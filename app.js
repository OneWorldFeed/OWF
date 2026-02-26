import { initRouter } from "./modules/router/router.js";
import { initNavigation } from "./modules/nav/nav.js";

document.addEventListener("DOMContentLoaded", () => {
    initRouter();
    initNavigation();
});
