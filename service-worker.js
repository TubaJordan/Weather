const CACHE_NAME = 'weather-app-v1';
const FILES_TO_CACHE = [
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/images/android-chrome-192x192.png',
    '/images/android-chrome-512x512.png',
    '/images/apple-touch-icon.png',
    '/images/favicon-16x16.png',
    '/images/favicon-32x32.png',
    '/images/mstile-150x150.png',
    '/images/Landscape.png'
];

self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('/api/')) {
        // Network-first strategy for API requests
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match(event.request);
            })
        );
    } else {
        // Cache-first strategy for other requests (like static assets)
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    }
});