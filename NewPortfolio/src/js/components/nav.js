import { loadTemplate } from "../functions/templates.js";
import { loadData } from "../functions/data.js";

export async function initNav() {
  const data = await loadData("src/asset/data/site.json");
  const nav = document.createElement("nav");
  let navTmpl = await loadTemplate("./src/template/nav.tmpl");
  // Replace Place-holder
  navTmpl = navTmpl
    .replace(/{{about}}/g, data.banner.about)
    .replace(/{{home}}/g, data.banner.home)
    .replace(/{{contact}}/g, data.banner.contact);
  nav.innerHTML = navTmpl;
  // Append on App
  const headerEl = document.querySelector("header");
  if (headerEl) {
    headerEl.insertAdjacentElement("afterend", nav);
  }
}
