import { loadTemplate } from "../functions/templates.js";
import { loadData } from "../functions/data.js";
import { createSkillsTags } from "../functions/tags.js";
import { normalizeSkillsData } from "../functions/utils-skills.js";

export async function initAbout() {
  const dataSite = await loadData("src/asset/data/site.json");
  const dataPerso = await loadData("src/asset/data/personal-info.json");
  const about = document.createElement("section");
  about.id = "about-me";
  about.className = "mainPanel about-me";
  let aboutTmpl = await loadTemplate("./src/template/about.tmpl");
  // Replace Place-holder
  aboutTmpl = aboutTmpl
    .replace(/{{about_title}}/g, dataSite.about.title)
    .replace(/{{job}}/g, dataPerso.job)
    .replace(/{{about_me}}/g, dataPerso.about_me)
    .replace(/{{hobby_title}}/g, dataSite.about.hobby_title);
  about.innerHTML = aboutTmpl;

  const skills = await loadData("src/asset/data/skills.json");
  const normalized = normalizeSkillsData(skills);

  // Section hobbies
  if (normalized.interests) {
    const hobbiesBlock = document.createElement("div");
    hobbiesBlock.classList.add("hobbies-section");

    // Parcourt chaque catégorie de hobbies (ex: musique, jeux vidéo, autres)
    Object.entries(normalized.interests).forEach(([categoryName, category]) => {
      // Titre de la catégorie
      const categoryTitle = document.createElement("h3");
      categoryTitle.textContent = category.title || categoryName;
      hobbiesBlock.appendChild(categoryTitle);

      // Description si dispo
      if (category.description) {
        const categoryDesc = document.createElement("p");
        categoryDesc.textContent = category.description;
        categoryDesc.classList.add("hobby-description");
        hobbiesBlock.appendChild(categoryDesc);
      }

      // 🔹 Ici on passe bien les items (un tableau), et pas l'objet complet
      hobbiesBlock.appendChild(
        createSkillsTags(category.items, category.items, "tag-general")
      );
    });

    about.appendChild(hobbiesBlock);
  }

  // Append on App
  document.getElementById("app").appendChild(about);
}
