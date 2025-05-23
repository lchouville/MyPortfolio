import { initTheme } from "./init/theme.js";
import { initTabs } from "./init/tabs.js";
import { fetchInfo } from "./init/info.js";
import { fetchFormation } from "./init/formation.js";
import { fetchProjects } from "./init/project.js";
import { fetchExperience } from "./init/experience.js";
import { initContact } from "./init/contact.js";
import { fetchAboutMe } from "./init/about.js";

export function init() {
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initTabs();
    
    fetchInfo();
    fetchAboutMe();
    fetchFormation();
    fetchProjects();
    fetchExperience();

    initContact();
  });
}
