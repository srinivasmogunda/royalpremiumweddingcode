import { getConfig, configStore, CONFIG_KEY, isAuthed, json, options, corsHeaders } from './_shared.mjs';
import { getRsvps } from './_shared.mjs';

export default async function handler(request) {
  if (request.method === 'OPTIONS') return options();
  if (!(await isAuthed(request))) return json({ error: 'Invalid admin password.' }, 401, corsHeaders());
  try {
    if (request.method === 'GET') {
      return json({ config: await getConfig(), rsvps: await getRsvps() }, 200, corsHeaders());
    }
    if (request.method === 'POST') {
      const data = await request.json();
      if (!data.config || typeof data.config !== 'object') return json({ error: 'Invalid config.' }, 400, corsHeaders());
      await configStore.setJSON(CONFIG_KEY, data.config);
      return json({ config: data.config }, 200, corsHeaders());
    }
    return new Response('Method not allowed.', { status: 405 });
  } catch (error) {
    console.error(error);
    return json({ error: 'Could not save or load configuration.' }, 500, corsHeaders());
  }
}

export const config = { path: '/api/admin/config' };
