'use strict';

const CACHE_NAME='magical-fun-shell-v52-question-banks';
const APP_ROOT=new URL('./',self.registration.scope);
const APP_SHELL=[
  APP_ROOT.href,
  new URL('index.html',APP_ROOT).href,
  new URL('question-banks/math.js',APP_ROOT).href,
  new URL('question-banks/story-math.js',APP_ROOT).href,
  new URL('question-banks/riddle_en_all.js',APP_ROOT).href,
  new URL('question-banks/Riddle_RU_all.js',APP_ROOT).href,
  new URL('question-banks/riddles_he_all.js',APP_ROOT).href,
  new URL('question-banks/escape-room-6-7.js',APP_ROOT).href,
  new URL('question-banks/escape-room-8-9.js',APP_ROOT).href,
  new URL('question-banks/escape-room-10-11.js',APP_ROOT).href,
  new URL('question-banks/science_he_6-11.js',APP_ROOT).href,
  new URL('question-banks/science_6-7_en.js',APP_ROOT).href,
  new URL('question-banks/science_6-7_ru.js',APP_ROOT).href,
  new URL('question-banks/science_8-9_en.js',APP_ROOT).href,
  new URL('question-banks/science_8-9_ru.js',APP_ROOT).href,
  new URL('question-banks/science_10-11_en.js',APP_ROOT).href,
  new URL('question-banks/science_10-11_ru.js',APP_ROOT).href,
  new URL('images/magical-fun-background.png',APP_ROOT).href,
  new URL('manifest.json',APP_ROOT).href,
  new URL('fonts/GveretLevin-Regular.ttf',APP_ROOT).href,
  new URL('privacy.html',APP_ROOT).href,
  new URL('terms.html',APP_ROOT).href,
  new URL('delete-account.html',APP_ROOT).href
];

async function cacheResponse(request,response){
  if(response.ok){
    try{
      const cache=await caches.open(CACHE_NAME);
      await cache.put(request,response.clone());
    }catch(error){
      console.error('Could not cache app resource:',error);
    }
  }
  return response;
}

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(
    keys.filter(key=>(key.startsWith('megical-fun-')||key.startsWith('magical-fun-'))&&key!==CACHE_NAME).map(key=>caches.delete(key))
  )).then(()=>self.clients.claim()));
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  const url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin||url.pathname.includes('/api/'))return;

  if(request.mode==='navigate'){
    event.respondWith(fetch(request).then(response=>cacheResponse(request,response)).catch(async()=>{
      const cached=await caches.match(request);
      return cached||caches.match(APP_ROOT.href);
    }));
    return;
  }

  event.respondWith(fetch(request).then(response=>cacheResponse(request,response)).catch(async()=>{
    const cached=await caches.match(request);
    return cached;
  }));
});

