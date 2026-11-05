import { mediaStore } from './_shared.mjs';

export default async function handler(request, context) {
  if (request.method !== 'GET') return new Response('Method not allowed.', { status: 405 });
  try {
    const key = context.params?.key ? decodeURIComponent(context.params.key) : '';
    if (!key) return new Response('Not found', { status: 404 });
    const entry = await mediaStore.getWithMetadata(key, { type: 'arrayBuffer' });
    if (!entry) return new Response('Not found', { status: 404 });
    const contentType = entry.metadata?.contentType || 'application/octet-stream';
    return new Response(entry.data, {
      status: 200,
      headers: {
        'content-type': contentType,
        'cache-control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response('Asset error', { status: 500 });
  }
}

export const config = { path: '/asset/:key' };
