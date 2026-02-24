// Thin wrapper so Vite can serve the service worker from the public root.
// The real logic lives in src/sw.js so it can be versioned with the app.

self.importScripts("/src/sw.js");
