const CACHE_NAME = 'img-webp-v1';
const PRECACHE = [
    './background_q75.webp',
    './background_q85.webp',
    './background.webp',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isWebp =
    req.destination === 'image' &&
    (req.headers.get('accept')?.includes('image/webp') || url.pathname.endsWith('.webp'));

  if (!isWebp) return;

  event.respondWith((async () => {
    try {
      const networkResp = await fetch(req);
      event.waitUntil((async () => {
        if (networkResp && networkResp.ok && networkResp.type !== 'opaque') {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(req, networkResp.clone());
        }
      })());
      return networkResp;
    } catch {
      const cached = await caches.match(req);
      if (cached) return cached;
      return Response.error();
    }
  })());
});
