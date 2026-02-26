import { navigate } from "../router/router.js";

export function initNavigation() {
    const navItems = document.querySelectorAll("[data-nav]");

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const target = item.getAttribute("data-nav");
            navigate(target);
        });
    });
}
