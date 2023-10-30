const outputAbsolute = document.getElementById('absolute');
const outputRelative = document.getElementById('relative');
const outputInfo = document.getElementById('info');

init();

async function init() {
    await printInfo();
    const isAllowed = await getPermission() === 'granted';
    if (!isAllowed) return;
    initListeners();
}

function initListeners() {
    initListener(outputAbsolute, 'deviceorientationabsolute');
    initListener(outputRelative, 'deviceorientation');

    function initListener(outputEl, eventName) {
        window.addEventListener(eventName, e => {
            outputEl.innerHTML = JSON.stringify({
                absolute: e.absolute,
                alpha: e.alpha,
                beta: e.beta,
                gamma: e.gamma,
                webkitCompassHeading: e.webkitCompassHeading,
                webkitCompassAccuracy: e.webkitCompassAccuracy,
                alphaFixed: typeof e.webkitCompassHeading === 'undefined' ? e.alpha : Math.abs(e.webkitCompassHeading - 360),
            }, null, 2);
        });
    }
}

async function printInfo() {
    outputInfo.innerHTML = JSON.stringify({
        deviceorientation: typeof window.ondeviceorientation !== 'undefined',
        deviceorientationabsolute: typeof window.ondeviceorientationabsolute !== 'undefined',
        DeviceOrientationEvent: typeof DeviceOrientationEvent !== 'undefined',
        requestPermission: typeof DeviceOrientationEvent.requestPermission === 'function',
        permission: await getPermission(),
    }, null, 2);
}

async function getPermission() {
    const needPermission = typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function';
    return needPermission ? await DeviceOrientationEvent.requestPermission() : 'granted';
}

