const CACHE="anomaly-fusion-v3-0-ultimate-r63";
const FILES=["./","./index.html","./game.js","./manifest.webmanifest","./anomaly-fusion-icon.svg","./AnomalyFusion.mp3"];
self.addEventListener("install",event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 await Promise.all(FILES.map(async file=>{try{const response=await fetch(file,{cache:"reload"});if(response.ok)await cache.put(file,response)}catch(e){}}));
 await self.skipWaiting();
})()));
self.addEventListener("activate",event=>event.waitUntil((async()=>{
 const keys=await caches.keys();
 await Promise.all(keys.filter(key=>key.startsWith("anomaly-fusion-")&&key!==CACHE).map(key=>caches.delete(key)));
 await self.clients.claim();
})()));
self.addEventListener("message",event=>{if(event.data&&event.data.type==="SKIP_WAITING")self.skipWaiting()});
self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET")return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const key=event.request.mode==="navigate"?"./index.html":event.request;
  const cached=await cache.match(key);
  if(cached)return cached;
  try{
   const response=await fetch(event.request);
   if(response&&response.ok&&(event.request.url.startsWith(self.location.origin))){
    try{await cache.put(event.request,response.clone())}catch(e){}
   }
   return response;
  }catch(e){
   return cached||Response.error();
  }
 })());
});
