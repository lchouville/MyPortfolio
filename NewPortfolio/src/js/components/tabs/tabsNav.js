import { loadData } from "../../functions/data.js";
import { loadTemplate } from "../../functions/templates.js";

export async function initMainTab() {
  const dataSite = await loadData("src/asset/data/site.json");
  const tabs = document.createElement("div");
  tabs.id = "tab-container";
  tabs.className = "mainPanel tab-container";

  let tabsNav = await loadTemplate("./src/template/tabs/tabsNav.tmpl");
  tabsNav = tabsNav
    .replace(/{{projects}}/g, dataSite.tabs.projects)
    .replace(/{{skills}}/g, dataSite.tabs.skills)
    .replace(/{{certifications}}/g, dataSite.tabs.certifications)
    .replace(/{{Experiences}}/g, dataSite.tabs.Experiences);

  tabs.innerHTML = tabsNav;
  document.getElementById("app").appendChild(tabs);

  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  // Helper: activate a tab by ID
  const activateTab = (tabId) => {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabContents.forEach((content) => content.classList.remove("active"));

    const button = [...tabButtons].find(
      (btn) => btn.getAttribute("data-tab") === tabId
    );
    const content = document.getElementById(tabId);

    if (button && content) {
      button.classList.add("active");
      content.classList.add("active");
      localStorage.setItem("activeTabs", tabId);
    }
  };

  // Restore last active tab or fallback to the first
  const savedTabId =
    localStorage.getItem("activeTabs") ||
    tabButtons[0]?.getAttribute("data-tab");
  activateTab(savedTabId);

  // Bind click events
  tabButtons.forEach((button) => {
    button.addEventListener("click", () =>
      activateTab(button.getAttribute("data-tab"))
    );
  });
}
