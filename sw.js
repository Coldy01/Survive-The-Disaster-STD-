// Survive The Disaster - Service Worker
const CACHE_NAME = 'survive-the-disaster-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/chapters.html',
  '/manifest.json',
  '/index.css',
  '/game.css',
  '/index.js',
  '/game-logic.js',
  '/audio.js',
  // Level HTML files
  '/1e.html',
  '/1f.html',
  '/2e.html',
  '/2f.html',
  '/3e.html',
  '/3f.html',
  '/4e.html',
  '/4f.html',
  // Main audio
  '/MainBgAudio.mp3',
  // Backgrounds
  '/backgrounds/MainBg.png',
  // Player sprites
  '/player/Idle.png',
  '/player/Walk1.png',
  '/player/Walk2.png',
  '/player/Walk3.png',
  '/player/Walk4.png',
  '/player/Walk5.png',
  '/player/Walk6.png',
  '/player/Walk7.png',
  '/player/Walk8.png',
  '/player/Walk9.png',
  '/player/Walk10.png',
  '/player/Walk11.png',
  '/player/Walk12.png'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching Files');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
      .catch(() => {
        // If both fail, return the offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      })
  );
});

// Handle messages from the main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
