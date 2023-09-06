self.addEventListener('install', e => {
    console.log('installed');
});

self.addEventListener('activate', e => {
    console.log('activated');
});

self.addEventListener('fetch', async (e) => {
    console.log('fetching', e.request.url);
    const response = await fetch(e.request);
    e.respondWith(response);
});
