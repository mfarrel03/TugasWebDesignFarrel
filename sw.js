const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
    '/',
    'index.html',
    'about.html',
    'contact.html',
    'style.css',
    'hero-image.jpg',
    'App.js',
    'image.jpg',
    'souvenir1.jpg',
    'souvenir2.jpg',
    'souvenir3.jpg',
    'manifest.json',
    
];

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Jika ada dalam cache, kembalikan response
                if (response) {
                    return response;
                }

                // Jika tidak ada dalam cache, lakukan fetch dari jaringan
                return fetch(event.request).then((response) => {
                    // Cache response yang berhasil di-fetch
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone response dan cache-nya
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });

                    return response;
                });
            }).catch((error) => {
                console.error('Fetching failed:', error);
            })
    );
});

// Activate event to clean up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});