const button = document.getElementById('init');
const outputAbsolute = document.getElementById('absolute');
const outputRelative = document.getElementById('relative');
const outputInfo = document.getElementById('info');

button.addEventListener('click', () => init());

async function init() {
    await printInfo();
    if (!await isAllowed()) return;
    initListeners();
}

function initListeners() {
    initListener(outputAbsolute, 'deviceorientationabsolute');
    initListener(outputRelative, 'deviceorientation');

    function initListener(outputEl, eventName) {
        window.addEventListener(eventName, e => {
            outputEl.innerHTML = JSON.stringify({
                alphaFixed: Math.round(typeof e.webkitCompassHeading === 'undefined' ? e.alpha : (360 - e.webkitCompassHeading)),
                alpha: Math.round(e.alpha),
                beta: Math.round(e.beta),
                gamma: Math.round(e.gamma),
                webkitCompassHeading: Math.round(e.webkitCompassHeading),
                webkitCompassAccuracy: Math.round(e.webkitCompassAccuracy),
                absolute: e.absolute,
            }, null, 2);
        });
    }
}

async function printInfo() {
    outputInfo.innerHTML = JSON.stringify({
        deviceorientation: typeof window.ondeviceorientation !== 'undefined',
        deviceorientationabsolute: typeof window.ondeviceorientationabsolute !== 'undefined',
        requestPermission: typeof DeviceOrientationEvent.requestPermission === 'function',
        isAllowed: await isAllowed(),
    }, null, 2);
}

async function isAllowed() {
    if (!window.DeviceOrientationEvent) return false;
    if (!DeviceOrientationEvent.requestPermission) return true;
    try {
        return await DeviceOrientationEvent.requestPermission() === 'granted';
    } catch (e) {
        console.warn(e);
        return false;
    }
}
