const buttonOrientation = document.getElementById('orientation-init');
const outputOrientation = document.getElementById('orientation');
const outputOrientationInfo = document.getElementById('orientation-info');

buttonOrientation.addEventListener('click', () => initOrientation());

async function initOrientation() {
    await printOrientationInfo();
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
            outputOrientation.innerHTML = JSON.stringify({
                alpha: Math.round(data.alpha),
                beta: Math.round(data.beta),
                gamma: Math.round(data.gamma),
            }, null, 2);
            const container = document.querySelector('.orientationMeters');
            ['alpha', 'beta', 'gamma'].forEach(metric => {
                const el = container.querySelector(`.${metric}`);
                el.querySelector('meter').value = data[metric];
            });
        });
    });
}

async function printOrientationInfo() {
    outputOrientationInfo.innerHTML = JSON.stringify({
        deviceorientation: typeof window.ondeviceorientation !== 'undefined',
        deviceorientationabsolute: typeof window.ondeviceorientationabsolute !== 'undefined',
        requestPermission: typeof DeviceOrientationEvent?.requestPermission === 'function',
        isAllowed: await isOrientationAllowed(),
    }, null, 2);
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
const outputMotion = document.getElementById('motion');
const outputMotionInfo = document.getElementById('motion-info');

buttonMotion.addEventListener('click', () => initMotion());

async function initMotion() {
    await printMotionInfo();
    if (!await isMotionAllowed()) return;
    initMotionListener();
}

function initMotionListener() {
    window.addEventListener('devicemotion', e => {
        requestAnimationFrame(() => {
            outputMotion.innerHTML = JSON.stringify({
                rotationRate: {
                    alpha: Math.round(e.rotationRate.alpha),
                    beta: Math.round(e.rotationRate.beta),
                    gamma: Math.round(e.rotationRate.gamma),
                },
                acceleration: {
                    x: Math.round(e.acceleration.x),
                    y: Math.round(e.acceleration.y),
                    z: Math.round(e.acceleration.z),
                },
                accelerationIncludingGravity: {
                    x: Math.round(e.accelerationIncludingGravity.x),
                    y: Math.round(e.accelerationIncludingGravity.y),
                    z: Math.round(e.accelerationIncludingGravity.z),
                },
                interval: e.interval,
            }, null, 2);
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
        const maxEl = el.querySelector('.max');
        const max = Math.abs(Number(maxEl.textContent.trim()));
        const roundedValue = Math.abs(Math.round(value));
        if (roundedValue > max) maxEl.textContent = roundedValue;
    });
}

async function printMotionInfo() {
    outputMotionInfo.innerHTML = JSON.stringify({
        devicemotion: typeof window.ondevicemotion !== 'undefined',
        requestPermission: typeof DeviceMotionEvent?.requestPermission === 'function',
        isAllowed: await isMotionAllowed(),
    }, null, 2);
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
