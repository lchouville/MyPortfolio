import { initTheme } from "./components/themes.js";
import {loadTemplate} from "./functions/templates.js"

document.addEventListener("DOMContentLoaded", async () => {
    const template = await loadTemplate('./src/template/themes.tmpl');
    document.getElementById('themeSelectorContainer').innerHTML = template;
    initTheme();
});
