const header = document.querySelector("header");
const footer = document.querySelector("footer");
const checkbox = document.querySelector('input[type="checkbox"]');

checkbox.addEventListener("change", toggleVisualViewportListener);

function toggleVisualViewportListener() {
    if (checkbox.checked) {
        window.visualViewport.addEventListener("scroll", updateTop);
        updateTop();
    } else {
        window.visualViewport.removeEventListener("scroll", updateTop);
        header.style.top = "0";
        footer.style.bottom = "0";
    }
}

function updateTop() {
    header.style.top = window.visualViewport.offsetTop + "px";
    footer.style.bottom = window.visualViewport.offsetTop + "px";
}
