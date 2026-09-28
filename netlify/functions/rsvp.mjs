import { getRsvps, json, options, corsHeaders, rsvpStore, RSVP_KEY } from './_shared.mjs';

export default async function handler(request) {
  if (request.method === 'OPTIONS') return options();
  if (request.method !== 'POST') return new Response('Method not allowed.', { status: 405 });
  try {
    const data = await request.json();
    const payload = {
      name: String(data.name || '').trim().slice(0, 160),
      guests: Math.max(1, Math.min(10, Number(data.guests || 1))),
      message: String(data.message || '').trim().slice(0, 1000),
      attendance: data.attendance === 'no' ? 'no' : 'yes',
      createdAt: new Date().toISOString(),
    };
    if (!payload.name) return json({ error: 'Name is required.' }, 400, corsHeaders());
    const list = await getRsvps();
    list.push(payload);
    await rsvpStore.setJSON(RSVP_KEY, list);
    return json({ ok: true }, 200, corsHeaders());
  } catch (error) {
    console.error(error);
    return json({ error: 'Could not save RSVP.' }, 500, corsHeaders());
  }
}

export const config = { path: '/api/rsvp' };
