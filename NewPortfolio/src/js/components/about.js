import { loadTemplate } from "../functions/templates.js";
import { loadData } from "../functions/data.js";
import { createTagsList } from "../functions/tags.js";

export async function initAbout() {
  const dataSite = await loadData("src/asset/data/site.json");
  const dataPerso = await loadData("src/asset/data/personal-info.json");
  const about = document.createElement("section");
  about.id = "about-me"
  let aboutTmpl = await loadTemplate("./src/template/about.tmpl");
  // Replace Place-holder
  aboutTmpl = aboutTmpl
    .replace(/{{about_title}}/g, dataSite.about.title)
    .replace(/{{job}}/g, dataPerso.job)
    .replace(/{{about_me}}/g, dataPerso.about_me)
    .replace(/{{hobby_title}}/g, dataSite.about.hobby_title)
  about.innerHTML = aboutTmpl;

  about.appendChild(createTagsList(dataPerso.interests,"interests-tag"))
  // Append on App
  document.getElementById("app").appendChild(about);
}
