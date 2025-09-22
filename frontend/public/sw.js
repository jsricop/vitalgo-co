// VitalGo Service Worker
// Minimal service worker to prevent 404 errors

self.addEventListener('install', (event) => {
  console.log('VitalGo Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('VitalGo Service Worker activated');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // For now, just let the browser handle all requests normally
  // This prevents 404 errors while maintaining normal functionality
});