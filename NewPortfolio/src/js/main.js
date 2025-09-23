import { initTheme } from "./components/themes.js";
import { initBanner } from "./components/banner.js";
import { initNav } from "./components/nav.js";
import { loadTemplate } from "./functions/templates.js";
import { initAbout } from "./components/about.js";
import { initContact } from "./components/contact.js";
import { initFooter } from "./components/footer.js";
import { initMainTab } from "./components/tabsNav.js";
import { fetchProjects } from "./components/tabs/project.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Load Header
  await initBanner();
  await initNav();
  await initAbout();

  // Load Tabs
  await initMainTab();
  await fetchProjects();

  // Load Containt
  await initContact();
  
  // Load Footer
  await initFooter();
  
  // Load Themes Selector
  document.getElementById("themeSelectorContainer").innerHTML =
    await loadTemplate("./src/template/themes.tmpl");
  initTheme();
});
