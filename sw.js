const CACHE="anomaly-fusion-v3-0-ultimate-r41";
const FILES=["./","./index.html","./game.js","./manifest.webmanifest","./anomaly-fusion-icon.svg"];
self.addEventListener("install",event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await Promise.all(FILES.map(async file=>{try{const response=await fetch(file,{cache:"reload"});if(response.ok)await cache.put(file,response)}catch(e){}}));await self.skipWaiting()})()));
self.addEventListener("activate",event=>event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(key=>key.startsWith("anomaly-fusion-")&&key!==CACHE).map(key=>caches.delete(key)));await self.clients.claim()})()));
self.addEventListener("message",event=>{if(event.data&&event.data.type==="SKIP_WAITING")self.skipWaiting()});
self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET")return;
 const url=new URL(event.request.url);if(url.origin!==self.location.origin)return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);const key=event.request.mode==="navigate"?"./index.html":event.request;
  try{const response=await fetch(event.request,{cache:"no-store"});if(response&&response.ok){cache.put(key,response.clone()).catch(()=>{});return response}}
  catch(e){}
  const cached=await cache.match(key)||await cache.match(event.request)||await cache.match("./index.html");if(cached)return cached;
  return new Response("Sin conexión. Vuelve a conectarte para cargar Anomaly Fusion.",{status:503,headers:{"Content-Type":"text/plain;charset=utf-8"}})
 })())
});
