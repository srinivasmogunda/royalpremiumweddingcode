import { authStore, AUTH_KEY, authConfigured, hashPassword, json, options, corsHeaders } from './_shared.mjs';

export default async function handler(request) {
  if (request.method === 'OPTIONS') return options();
  if (request.method !== 'POST') return new Response('Method not allowed.', { status: 405 });
  try {
    if (await authConfigured()) return json({ error: 'Admin password is already configured.' }, 409, corsHeaders());
    const data = await request.json();
    const password = String(data.password || '');
    if (password.length < 8) return json({ error: 'Use at least 8 characters.' }, 400, corsHeaders());
    const result = await authStore.setJSON(AUTH_KEY, hashPassword(password), { onlyIfNew: true });
    if (!result.modified) return json({ error: 'Admin password is already configured.' }, 409, corsHeaders());
    return json({ ok: true }, 200, corsHeaders());
  } catch (error) {
    console.error(error);
    return json({ error: 'Could not configure admin password.' }, 500, corsHeaders());
  }
}

export const config = { path: '/api/admin/setup' };
