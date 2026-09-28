import { getStore } from '@netlify/blobs';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const REGION = 'ap-southeast-1';
export const configStore = getStore({ name: 'wedding-config', region: REGION });
export const rsvpStore = getStore({ name: 'wedding-rsvps', region: REGION });
export const authStore = getStore({ name: 'wedding-auth', region: REGION });
export const mediaStore = getStore({ name: 'wedding-media', region: REGION });

export const CONFIG_KEY = 'config.json';
export const RSVP_KEY = 'rsvps.json';
export const AUTH_KEY = 'admin-auth.json';

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...extraHeaders,
    },
  });
}

export function readBundledConfig() {
  try {
    const file = path.join(process.cwd(), 'data', 'config.json');
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return {};
  }
}

export async function getConfig() {
  let config = await configStore.get(CONFIG_KEY, { type: 'json', consistency: 'strong' });
  if (config === null) {
    config = readBundledConfig();
    await configStore.setJSON(CONFIG_KEY, config);
  }
  return config;
}

export async function getRsvps() {
  return (await rsvpStore.get(RSVP_KEY, { type: 'json', consistency: 'strong' })) || [];
}

export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 32, 'sha256').toString('hex');
  return { salt, hash };
}

export async function authConfigured() {
  const auth = await authStore.get(AUTH_KEY, { type: 'json', consistency: 'strong' });
  return !!(auth && typeof auth.hash === 'string' && auth.hash && typeof auth.salt === 'string' && auth.salt);
}

export async function passwordOk(password) {
  const auth = await authStore.get(AUTH_KEY, { type: 'json', consistency: 'strong' });
  if (!auth) return false;
  const trial = hashPassword(password, auth.salt).hash;
  const a = Buffer.from(trial, 'hex');
  const b = Buffer.from(auth.hash, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function isAuthed(request) {
  const password = request.headers.get('x-admin-password') || '';
  return (await authConfigured()) && password.length > 0 && (await passwordOk(password));
}

export function methodNotAllowed() {
  return json({ error: 'Method not allowed.' }, 405, { allow: 'GET, POST, PUT, OPTIONS' });
}

export function corsHeaders() {
  return {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, OPTIONS',
    'access-control-allow-headers': 'content-type, x-admin-password',
  };
}

export function options() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export function safeName(name) {
  return String(name || 'upload').replace(/[^a-zA-Z0-9._-]+/g, '-').slice(-120) || 'upload';
}
