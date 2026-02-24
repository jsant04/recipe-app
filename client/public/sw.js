// Standalone service worker served from the public root for production.
// This mirrors the logic from src/sw.js but avoids importing /src/*,
// which doesn't exist in the built Vite output on Vercel.

const VERSION = "v1";
const CACHE_NAME = `recipes-pwa-${VERSION}`;

// URLs to precache for the app shell
const PRECACHE_URLS = [
	"/",
	"/index.html",
	"/offline.html",
	"/manifest.webmanifest",
	"/icons/pantrypro-logo.png",
	"/icons/icon-192.svg",
	"/icons/icon-512.svg",
];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(PRECACHE_URLS);
		})
	);
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((keys) => {
			return Promise.all(
				keys
					.filter((key) => key.startsWith("recipes-pwa-") && key !== CACHE_NAME)
					.map((key) => caches.delete(key))
			);
		})
	);
});

self.addEventListener("fetch", (event) => {
	const request = event.request;
	const url = new URL(request.url);

	if (url.origin !== self.location.origin) return;

	if (request.mode === "navigate") {
		event.respondWith(
			fetch(request).catch(() => caches.match("/offline.html"))
		);
		return;
	}

	if (url.pathname.startsWith("/api/")) {
		event.respondWith(networkFirst(request));
		return;
	}

	if (request.destination === "image" || url.pathname.includes("categories")) {
		event.respondWith(staleWhileRevalidate(request));
		return;
	}

	event.respondWith(cacheFirst(request));
});

async function networkFirst(request) {
	try {
		const response = await fetch(request);
		const cache = await caches.open(CACHE_NAME);
		cache.put(request, response.clone());
		return response;
	} catch (err) {
		const cached = await caches.match(request);
		if (cached) return cached;
		throw err;
	}
}

async function staleWhileRevalidate(request) {
	const cache = await caches.open(CACHE_NAME);
	const cached = await cache.match(request);
	const networkPromise = fetch(request)
		.then((response) => {
			cache.put(request, response.clone());
			return response;
		})
		.catch(() => cached);
	return cached || networkPromise;
}

async function cacheFirst(request) {
	const cached = await caches.match(request);
	if (cached) return cached;
	const response = await fetch(request);
	const cache = await caches.open(CACHE_NAME);
	cache.put(request, response.clone());
	return response;
}
