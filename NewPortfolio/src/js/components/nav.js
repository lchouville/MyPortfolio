import { loadTemplate } from "../functions/templates.js"
import { loadData } from "../functions/data.js"

export async function initNav() {
    const data = await loadData("src/asset/data/personal-info.json")
    const nav = document.createElement("nav")
    let navTmpl = await loadTemplate('./src/template/nav.tmpl');
    // Replace Place-holder
    navTmpl = navTmpl
        .replace(/{{names}}/g,data.names)
    nav.innerHTML = navTmpl
    // Append on App
    document.body.appendChild(nav);
}