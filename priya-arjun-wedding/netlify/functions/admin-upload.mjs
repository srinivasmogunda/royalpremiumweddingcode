import crypto from 'node:crypto';
import { mediaStore, isAuthed, json, options, corsHeaders, safeName } from './_shared.mjs';

export default async function handler(request) {
  if (request.method === 'OPTIONS') return options();
  if (request.method !== 'PUT') return new Response('Method not allowed.', { status: 405 });
  if (!(await isAuthed(request))) return json({ error: 'Invalid admin password.' }, 401, corsHeaders());
  try {
    const url = new URL(request.url);
    const name = safeName(url.searchParams.get('name'));
    const contentType = request.headers.get('content-type') || 'application/octet-stream';
    const key = `${Date.now()}-${crypto.randomUUID()}-${name}`;
    const body = await request.arrayBuffer();
    await mediaStore.set(key, body, { metadata: { contentType, originalName: name } });
    return json({ url: `/asset/${encodeURIComponent(key)}` }, 200, corsHeaders());
  } catch (error) {
    console.error(error);
    return json({ error: 'Upload failed. Netlify Functions have a binary request limit; keep uploads small or use hosted URLs for large media.' }, 500, corsHeaders());
  }
}

export const config = { path: '/api/admin/upload' };
