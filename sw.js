// オフライン対応：アプリ本体は先に保存し、フォントは初回読み込み時に保存する
const CACHE="say-it-v11";
const CORE=["./","index.html","manifest.webmanifest","apple-touch-icon.png","icon-192.png","icon-512.png","icon-maskable-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||fetch(e.request).then(res=>{
    const url=new URL(e.request.url);
    if(res.ok||url.hostname.endsWith("gstatic.com")||url.hostname.endsWith("googleapis.com")){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}
    return res;
  }).catch(()=>caches.match("index.html"))));
});
