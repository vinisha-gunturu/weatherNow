const CACHE_NAME = 'weather-now-v1'
const STATIC_CACHE = 'weather-static-v1'
const API_CACHE = 'weather-api-v1'

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/favourites',
  '/settings',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
]

// API endpoints to cache
const API_ENDPOINTS = [
  'https://api.open-meteo.com',
  'https://geocoding-api.open-meteo.com'
]

// Install event - cache static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_FILES)
      }),
      caches.open(API_CACHE).then((cache) => {
        // Pre-cache some common API endpoints if needed
        return Promise.resolve()
      })
    ])
  )
  self.skipWaiting()
})

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle API requests
  if (API_ENDPOINTS.some(endpoint => url.href.startsWith(endpoint))) {
    event.respondWith(
      caches.open(API_CACHE).then(cache => {
        return fetch(request)
          .then(response => {
            // Only cache successful responses
            if (response.status === 200) {
              // Clone the response before caching
              const responseToCache = response.clone()
              cache.put(request, responseToCache)
            }
            return response
          })
          .catch(() => {
            // If network fails, try to serve from cache
            return cache.match(request).then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse
              }
              // Return a custom offline response for API calls
              return new Response(
                JSON.stringify({
                  error: 'Offline',
                  message: 'No cached data available'
                }),
                {
                  status: 503,
                  statusText: 'Service Unavailable',
                  headers: { 'Content-Type': 'application/json' }
                }
              )
            })
          })
      })
    )
    return
  }

  // Handle navigation requests (pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => {
          return caches.match('/') || caches.match(request)
        })
    )
    return
  }

  // Handle other requests (static files, etc.)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(request).then((response) => {
        // Cache successful responses
        if (response.status === 200 && request.method === 'GET') {
          const responseToCache = response.clone()
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, responseToCache)
          })
        }
        return response
      })
    })
  )
})

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  if (event.tag === 'weather-sync') {
    event.waitUntil(
      // Sync weather data when connection is restored
      syncWeatherData()
    )
  }
})

async function syncWeatherData() {
  try {
    // Get stored locations from IndexedDB or localStorage
    const locations = await getStoredLocations()
    
    // Fetch fresh data for each location
    for (const location of locations) {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,weather_code&timezone=auto`
      )
      
      if (response.ok) {
        const cache = await caches.open(API_CACHE)
        await cache.put(response.url, response.clone())
      }
    }
  } catch (error) {
    console.warn('Background sync failed:', error)
  }
}

async function getStoredLocations() {
  // This would typically get data from IndexedDB or localStorage
  // For now, return empty array
  return []
}

// Push notifications (for future enhancement)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      vibrate: [100, 50, 100],
      data: data.data || {}
    }

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  event.waitUntil(
    clients.matchAll().then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/')
      }
    })
  )
})
