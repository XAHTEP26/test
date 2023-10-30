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
        outputOrientation.innerHTML = JSON.stringify({
            alpha: Math.round(e.webkitCompassHeading ? (360 - e.webkitCompassHeading) : e.alpha),
            beta: Math.round(e.beta),
            gamma: Math.round(e.gamma),
            absolute: e.absolute,
            webkitCompassAccuracy: Math.round(e.webkitCompassAccuracy),
        }, null, 2);
    });
}

async function printOrientationInfo() {
    outputOrientationInfo.innerHTML = JSON.stringify({
        deviceorientation: !!window.ondeviceorientation,
        deviceorientationabsolute: !!window.ondeviceorientationabsolute,
        requestPermission: !!DeviceOrientationEvent?.requestPermission,
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
        outputMotion.innerHTML = JSON.stringify({
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
            rotationRate: {
                alpha: Math.round(e.rotationRate.alpha),
                beta: Math.round(e.rotationRate.beta),
                gamma: Math.round(e.rotationRate.gamma),
            },
            interval: e.interval,
        }, null, 2);
    });
}

async function printMotionInfo() {
    outputMotionInfo.innerHTML = JSON.stringify({
        devicemotion: !!window.ondevicemotion,
        requestPermission: !!DeviceMotionEvent?.requestPermission,
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
