const CACHE_NAME = "recipe-cache-v1";
const urlsToCache = [
	"/",
	"/index.html",
	"/manifest.json",
	"/assets/css/style.css",
	"/js/index.js",
	"/js/db.js",
	"/js/animations.js",
	"/assets/img/default.jpg",
	"/assets/icons/icon-192x192.png",
	"/assets/icons/icon-512x512.png"
];

// Устанавливаем Service Worker и кешируем файлы
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(urlsToCache);
		})
	);
});

// Обслуживание запросов из кеша
self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			return response || fetch(event.request);
		})
	);
});

// Очистка старого кеша при активации нового Service Worker
self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cache) => {
					if (cache !== CACHE_NAME) {
						return caches.delete(cache);
					}
				})
			);
		})
	);
});

self.addEventListener("install", (event) => {
	self.skipWaiting(); // Принудительное обновление service worker
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cache) => {
					return caches.delete(cache); // Очищаем старый кэш
				})
			);
		})
	);
});
