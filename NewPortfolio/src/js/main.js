import { initTheme } from "./components/themes.js";
import { initBanner } from "./components/banner.js";
import { initNav} from "./components/nav.js";
import { loadTemplate } from "./functions/templates.js"

document.addEventListener("DOMContentLoaded", async () => {
    // Load Header
    await initBanner();
    await initNav();
    // Load Themes Selector
    document.getElementById('themeSelectorContainer').innerHTML = await loadTemplate('./src/template/themes.tmpl');
    initTheme();
    
});
