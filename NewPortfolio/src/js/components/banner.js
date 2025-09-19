import { loadTemplate } from "../functions/templates.js"
import { loadData } from "../functions/data.js"

export async function initBanner(){
    const data = await loadData("src/asset/data/personal-info.json")
    const header = document.createElement("header")
    let headerTmpl = await loadTemplate('./src/template/banner.tmpl');
    // Replace Place-holder
    headerTmpl = headerTmpl
        .replace(/{{names}}/g,data.names)
        .replace(/{{quote-text}}/g,data.quote.text)
        .replace(/{{quote-author}}/g,data.quote.author);
    header.innerHTML = headerTmpl
    // Append on App
    document.body.appendChild(header);
}
