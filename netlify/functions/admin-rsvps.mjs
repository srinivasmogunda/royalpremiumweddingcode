import { getRsvps, isAuthed, json, options, corsHeaders } from './_shared.mjs';

export default async function handler(request) {
  if (request.method === 'OPTIONS') return options();
  if (request.method !== 'GET') return new Response('Method not allowed.', { status: 405 });
  if (!(await isAuthed(request))) return json({ error: 'Invalid admin password.' }, 401, corsHeaders());
  try { return json({ rsvps: await getRsvps() }, 200, corsHeaders()); }
  catch { return json({ error: 'Could not load RSVPs.' }, 500, corsHeaders()); }
}

export const config = { path: '/api/admin/rsvps' };
