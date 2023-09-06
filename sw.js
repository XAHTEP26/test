self.addEventListener('install', e => {
    console.log('installed');
});

self.addEventListener('activate', e => {
    console.log('activated');
});

self.addEventListener('fetch', e => {
    console.log('fetching');
});
