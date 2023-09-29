const header = document.querySelector("header");
const checkbox = document.querySelector('input[type="checkbox"]');

checkbox.addEventListener("change", toggleVisualViewportListener);

function toggleVisualViewportListener() {
    if (checkbox.checked) {
        window.visualViewport.addEventListener("scroll", updateTop);
        updateTop();
    } else {
        window.visualViewport.removeEventListener("scroll", updateTop);
        header.style.top = "0";
    }
}

function updateTop() {
    header.style.top = window.visualViewport.offsetTop + "px";
}
