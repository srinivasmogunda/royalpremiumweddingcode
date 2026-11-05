import { getRsvps, json, options, corsHeaders, rsvpStore, RSVP_KEY } from './_shared.mjs';

export default async function handler(request) {
  if (request.method === 'OPTIONS') return options();
  if (request.method !== 'POST') return new Response('Method not allowed.', { status: 405 });
  try {
    const data = await request.json();
    // The form sends adults, children and the chosen events as well. Keep them:
    // without them the guest list cannot tell who is coming to which ceremony,
    // or how many of the party are children.
    const count = (value, min, max) => {
      const n = Math.floor(Number(value));
      return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : min;
    };
    const adults = count(data.adults ?? 1, 1, 8);
    const children = count(data.children ?? 0, 0, 5);
    const payload = {
      name: String(data.name || '').trim().slice(0, 160),
      adults,
      children,
      // Trust the explicit breakdown over the total the form also sends.
      guests: adults + children,
      events: Array.isArray(data.events)
        ? data.events.map(e => String(e).trim().slice(0, 120)).filter(Boolean).slice(0, 20)
        : [],
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
