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
  const normalizedSkills = normalizeSkillsData(skills);

  // Section hobbies
  if (normalizedSkills.interests) {
    const hobbiesBlock = document.createElement("div");
    hobbiesBlock.classList.add("hobbies-section");
    
    // Add skills if any
    if (Array.isArray(dataPerso.interests) && dataPerso.interests.length > 0) {
      const interestsContainer = document.createElement("div");
      interestsContainer.classList.add("skills-container");

      interestsContainer.appendChild(
        createSkillsTags(dataPerso.interests, normalizedSkills.flat.interests, "tag-general")
      );
      hobbiesBlock.appendChild(interestsContainer);
      about.appendChild(hobbiesBlock);
    }

  }

  // Append on App
  document.getElementById("app").appendChild(about);
}
