import { initTheme } from "./init/theme.js";
import { initTabs } from "./init/tabs.js";
import { fetchInfo } from "./init/info.js";
import { fetchFormation } from "./init/formation.js";
import { fetchProjects } from "./init/project.js";
import { fetchExperience } from "./init/experience.js";
import { initContact } from "./init/contact.js";
import { fetchAboutMe } from "./init/about.js";
import { fetchSkill } from "./init/skill.js";

export function init() {
  document.addEventListener("DOMContentLoaded", async () => {
    initTheme();
    initTabs();

    fetchInfo();
    fetchSkill();
    fetchExperience();

    let formationData;
    try {
      const formationResponse = await fetch("data/formation.json");
      formationData = await formationResponse.json();
    } catch (error) {
      console.error(
        "Erreur lors du chargement du fichier education.json:",
        error
      );
    }

    let projectsData;
    try {
      const projectsResponse = await fetch("data/projects.json");
      projectsData = await projectsResponse.json();
    } catch (error) {
      console.error("Erreur lors du chargement du fichier projects.json:", error);
    }

    fetchFormation(formationData);
    fetchProjects(projectsData);
    fetchAboutMe(formationData, projectsData);

    initContact();
  });
}
