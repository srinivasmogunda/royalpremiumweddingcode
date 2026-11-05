import { getConfig, json, options, methodNotAllowed, corsHeaders } from './_shared.mjs';

export default async function handler(request) {
  if (request.method === 'OPTIONS') return options();
  if (request.method !== 'GET') return methodNotAllowed();
  try {
    return json(await getConfig(), 200, corsHeaders());
  } catch (error) {
    console.error(error);
    return json({ error: 'Could not load wedding configuration.' }, 500, corsHeaders());
  }
}

export const config = { path: '/api/config' };
