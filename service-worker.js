// const CACHE_NAME = 'quanvas-cache-v1';
const CACHE_NAME = 'quanvas-v1';

const IMAGE_ASSETS = [
    '/images/tools/pen.svg',
    '/images/tools/eraser.svg',
    '/images/tools/line.svg',
    '/images/tools/rectangle.svg',
    '/images/tools/circle.svg',
    '/images/tools/bezier.svg',
    '/images/tools/add-layer.svg',
    '/images/tools/arc-to.svg',
    '/images/tools/clipboard.svg',
    '/images/tools/ellipse.svg',
    '/images/tools/evenodd.svg',
    '/images/tools/nomove.svg',
    '/images/tools/nonzero.svg',
    '/images/tools/pen2.svg',
    '/images/tools/quadratic.svg',
    '/images/tools/round-rectangle.svg',
];

const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/app/index.js',
    '/app/service-worker.js',
    '/images/icons/quanvas.png',
    '/manifest.json',
    ...IMAGE_ASSETS
];


self.addEventListener("install", e => {
    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("active", e => {
    e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))))
    self.clients.claim();
});
self.addEventListener("fetch", e => {
    e.respondWith(caches.match(e.request).then(res => res || fetch(e.request).catch(() => caches.match("/offline.html"))))
});
