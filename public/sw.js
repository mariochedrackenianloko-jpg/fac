const CACHE_NAME = "fac-afrique-v1";
const STATIC_ASSETS = ["/", "/payment", "/cgv", "/confidentialite"];
const ALLOWED_ORIGINS = [self.location.origin];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Uniquement les requêtes GET du même origine
  if (event.request.method !== "GET") return;
  if (!ALLOWED_ORIGINS.includes(url.origin)) return;
  // Ne pas cacher les routes API/serveur
  if (url.pathname.startsWith("/_server") || url.pathname.startsWith("/api")) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).catch(() => caches.match("/"));
    })
  );
});
