const CACHE_NAME = 'identiscents-wms-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/logo.avif',
  '/companies',
  '/employees',
  '/warehouses',
  '/bin-sub-levels',
  '/bin-locations',
  '/jobs'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Cache installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // Network failed, try to return offline page for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
        });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Handle offline actions here
    console.log('Background sync triggered');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notification handler
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/logo.avif',
      badge: '/logo.avif',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      },
      actions: [
        {
          action: 'explore',
          title: 'View Details',
          icon: '/logo.avif'
        },
        {
          action: 'close',
          title: 'Dismiss',
          icon: '/logo.avif'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handler for cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Install prompt handling
self.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  // Store the event for later use
  self.deferredPrompt = event;
});

// Network status handling
self.addEventListener('online', () => {
  console.log('App is online');
});

self.addEventListener('offline', () => {
  console.log('App is offline');
});

// Handle app updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
    // Notify the app about updates
    event.ports[0].postMessage({
      type: 'UPDATE_READY'
    });
  }
});