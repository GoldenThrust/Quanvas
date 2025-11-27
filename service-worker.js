const CACHE_NAME = 'quanvas-cache-v1';

const IMAGE_ASSETS = [
    '/images/tools/add-layer.svg',
    '/images/tools/C-circle.svg',
    '/images/tools/C-ellipse.svg',
    '/images/tools/clipboard.svg',
    '/images/tools/eraser.svg',
    '/images/tools/fill.svg',
    '/images/tools/K-bezier.svg',
    '/images/tools/K-quadratic.svg',
    '/images/tools/L-arcto.svg',
    '/images/tools/L-line.svg',
    '/images/tools/P-chalk.svg',
    '/images/tools/P-pen.svg',
    '/images/tools/R-rectangle.svg',
    '/images/tools/R-roundrectangle.svg',
    '/images/tools/stroke.svg',

    '/images/icons/create.svg',
    '/images/icons/delete.svg',
    '/images/icons/menu.svg',
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

self.addEventListener("activate", e => {
    e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))))
    self.clients.claim();
});

self.addEventListener("fetch", e => {
    e.respondWith(networkFirst(e.request));
});


async function networkFirst(req) {
    const cache = await caches.open(CACHE_NAME);

    try {
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    } catch (err) {
        const cached = caches.match(req);
        return cached || Response.error();
    }
}