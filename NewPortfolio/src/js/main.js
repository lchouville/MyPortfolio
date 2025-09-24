import { initTheme } from "./components/themes.js";
import { initBanner } from "./components/banner.js";
import { initNav } from "./components/nav.js";
import { loadTemplate } from "./functions/templates.js";
import { initAbout } from "./components/about.js";
import { initContact } from "./components/contact.js";
import { initFooter } from "./components/footer.js";
import { initMainTab } from "./components/tabs/tabsNav.js";
import { fetchProjects } from "./components/tabs/project.js";
import { initHead } from "./components/head.js";
import { fetchEducation } from "./components/tabs/education.js";
import { fetchExperience } from "./components/tabs/experience.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Load Head
  await initHead();

  // Load Header
  await initBanner();
  await initNav();
  await initAbout();

  // Load Tabs
  await initMainTab();
  await fetchProjects();
  await fetchEducation();
  await fetchExperience();

  // Load Containt
  await initContact();

  // Load Footer
  await initFooter();

  // Load Themes Selector
  document.getElementById("themeSelectorContainer").innerHTML =
    await loadTemplate("./src/template/themes.tmpl");
  initTheme();
});
