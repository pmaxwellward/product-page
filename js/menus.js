
window.addEventListener("DOMContentLoaded",() => {

    let titleField = document.getElementById("title");
    const navItems = Array.from(document.getElementById("nav-items").children);

    navItems.forEach(item => {
        const titleDefault = titleField.innerText;

        item.addEventListener("mouseenter", () => {
            titleField.style.opacity = 0;
            titleField.innerText = item.innerText;
        });
        item.addEventListener("mouseleave", () => {
            titleField.innerText = titleDefault;
        });
    });

}, false);
