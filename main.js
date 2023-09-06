main();

async function main() {
    await registerServiceWorker();
    const response = await fetch('https://туристическаякарта26.рф/api/objects');
    const data = await response.json();
    console.log(data);
}

async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('./sw.js');
            if (registration.installing) {
                console.log('Service worker installing');
            } else if (registration.waiting) {
                console.log('Service worker installed');
            } else if (registration.active) {
                console.log('Service worker active');
            }
        } catch (e) {
            console.log(`Failed with error: ${e}`);
        }
    }
}
