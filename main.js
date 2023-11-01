const buttonOrientation = document.getElementById('orientation-init');
buttonOrientation.addEventListener('click', () => initOrientation());

async function initOrientation() {
    if (!await isOrientationAllowed()) return;
    initOrientationListener();
}

function initOrientationListener() {
    const eventName = window.ondeviceorientationabsolute ? 'deviceorientationabsolute' : 'deviceorientation';
    window.addEventListener(eventName, e => {
        requestAnimationFrame(() => {
            const data = {
                alpha: e.webkitCompassHeading ? 360 - e.webkitCompassHeading : e.alpha,
                beta: e.beta,
                gamma: e.gamma,
            };
            const container = document.querySelector('.orientation');
            ['alpha', 'beta', 'gamma'].forEach(metric => {
                const el = container.querySelector(`.${metric}`);
                el.querySelector('meter').value = data[metric];
                el.querySelector('.value').textContent = Math.round(data[metric]);
            });
        });
    });
}

async function isOrientationAllowed() {
    if (!window.DeviceOrientationEvent) return false;
    if (!DeviceOrientationEvent.requestPermission) return true;
    try {
        return await DeviceOrientationEvent.requestPermission() === 'granted';
    } catch (e) {
        console.warn(e);
        return false;
    }
}

/****************************************************/

const buttonMotion = document.getElementById('motion-init');
buttonMotion.addEventListener('click', () => initMotion());

async function initMotion() {
    if (!await isMotionAllowed()) return;
    initMotionListener();
}

function initMotionListener() {
    window.addEventListener('devicemotion', e => {
        requestAnimationFrame(() => {
            updateMeters(e, 'rotationRate', ['alpha', 'beta', 'gamma']);
            updateMeters(e, 'acceleration', ['x', 'y', 'z']);
            updateMeters(e, 'accelerationIncludingGravity', ['x', 'y', 'z']);
        })
    });
}

function updateMeters(e, name, metrics) {
    const container = document.querySelector(`.${name}`);
    metrics.forEach(metric => {
        const el = container.querySelector(`.${metric}`);
        const value = e[name][metric];
        el.querySelector('meter').value = value;
        el.querySelector('.value').textContent = Math.round(value);
    });
}

async function isMotionAllowed() {
    if (!window.DeviceMotionEvent) return false;
    if (!DeviceMotionEvent.requestPermission) return true;
    try {
        return await DeviceMotionEvent.requestPermission() === 'granted';
    } catch (e) {
        console.warn(e);
        return false;
    }
}

/****************************************************/

const buttonGeolocation = document.getElementById('geolocation-init');
buttonGeolocation.addEventListener('click', () => initGeolocation());

async function initGeolocation() {
    if (!await isGeolocationAllowed()) return;
    initGeolocationListener();
}

function initGeolocationListener() {
    navigator.geolocation.watchPosition((position) => {
        document.getElementById('geolocation').innerHTML = JSON.stringify({
            coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                altitude: position.coords.altitude,
                altitudeAccuracy: position.coords.altitudeAccuracy,
                heading: position.coords.heading,
                speed: position.coords.speed,
            },
            timestamp: position.timestamp,
        }, null, 2);
    });
}

async function isGeolocationAllowed() {
    if (!navigator.geolocation) return false;
    if (navigator.permissions) return (await navigator.permissions.query({name: 'geolocation'})).state === 'granted';
    return await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            () => resolve(true),
            (e) => {
                console.warn(e);
                reject(false);
            },
        );
    });
}
