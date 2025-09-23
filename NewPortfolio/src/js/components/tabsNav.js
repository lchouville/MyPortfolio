import { loadTemplate } from "../functions/templates.js";
import { loadData } from "../functions/data.js";
import { createTagsList } from "../functions/tags.js";

export async function initMainTab() {
  const dataSite = await loadData("src/asset/data/site.json");
  const dataPerso = await loadData("src/asset/data/personal-info.json");
  const tabs = document.createElement("section");
  tabs.id = "tab-container";
  tabs.className = "mainPanel tab-container";
  let tabsNav = await loadTemplate("./src/template/tabs/tabsNav.tmpl");
  // Replace Place-holder
  tabsNav = tabsNav
    .replace(/{{projects}}/g, dataSite.tabs.projects)
    .replace(/{{skills}}/g, dataSite.tabs.skills)
    .replace(/{{certifications}}/g, dataSite.tabs.certifications)
    .replace(/{{Experiences}}/g, dataSite.tabs.Experiences);
  tabs.innerHTML = tabsNav;

  // Append on App
  document.getElementById("app").appendChild(tabs);

  // Tab management
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Deactivate all tabs
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Activate the clicked tab
      button.classList.add("active");
      const tabId = button.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");
    });
  });
}
