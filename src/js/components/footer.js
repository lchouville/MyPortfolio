import { loadTemplate } from "../functions/templates.js";
import { loadData } from "../functions/data.js";

export async function initFooter() {
  const dataSite = await loadData("src/asset/data/site.json");
  const dataPerso = await loadData("src/asset/data/personal-info.json");
  const footer = document.createElement("footer");
  let footerTmpl = await loadTemplate("./src/template/footer.tmpl");
  // Replace Place-holder
  footerTmpl = footerTmpl
    .replace(/{{year}}/g, dataSite.footer.year)
    .replace(/{{copyright}}/g, dataSite.footer.copyright)
    .replace(/{{names}}/g, dataPerso.names);
  footer.innerHTML = footerTmpl;
  // Append on App
  document.body.append(footer);
}
