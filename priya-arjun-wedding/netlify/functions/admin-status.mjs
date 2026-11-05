import { authConfigured, json, options, corsHeaders, methodNotAllowed } from './_shared.mjs';

export default async function handler(request) {
  if (request.method === 'OPTIONS') return options();
  if (request.method !== 'GET') return methodNotAllowed();
  try { return json({ initialized: await authConfigured() }, 200, corsHeaders()); }
  catch { return json({ error: 'Could not check admin status.' }, 500, corsHeaders()); }
}

export const config = { path: '/api/admin/status' };
