/* ============================================================================
 * sw.js — makes Paint Mixer work offline once it is on the Home Screen
 * ============================================================================
 *
 * Strategy: cache-first, from a versioned cache filled at install time.
 *
 * Once installed, the app makes no network requests of its own, ever
 * (CLAUDE.md). Everything it needs is in the cache below. The only network
 * traffic left is the browser's own periodic check for a newer copy of this
 * file, which is how updates arrive and which the page does not control.
 *
 * !! EVERY RELEASE MUST CHANGE CACHE_VERSION !!
 * The browser only installs a new service worker when this file's bytes
 * change. Change index.html or any other shipped file without bumping the
 * version and installed copies keep serving the old app indefinitely.
 *
 * Updates: the new worker takes over at once (skipWaiting + claim). A page
 * already open keeps running the code it loaded; the next launch gets the new
 * version. That is safe here because the page loads everything it needs at
 * start-up and never fetches app files later.
 * ========================================================================= */

const CACHE_VERSION = 'paint-mixer-v1';

const APP_FILES = [
  './',
  'index.html',
  'mixbox.js',
  'pigments.js',
  'manifest.webmanifest',
  'icon-180.png',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      /* cache: 'reload' skips the HTTP cache, so a new version is never
         assembled from stale copies of files that changed */
      .then((cache) => cache.addAll(APP_FILES.map((u) => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k.startsWith('paint-mixer-') && k !== CACHE_VERSION)
            .map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   /* not ours: leave it alone */

  /* Any page navigation inside the app's scope gets the app shell, so a
     launch with a query string or a stale path still opens offline. */
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match(new URL('index.html', self.registration.scope).href, { ignoreSearch: true })
        .then((hit) => hit || fetch(req))
    );
    return;
  }

  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req))
  );
});
