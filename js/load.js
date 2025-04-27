import { initTheme } from "./init/theme.js";
import { initTabs } from "./init/tabs.js";
import { fetchFormation } from "./init/formation.js";
import { fetchInfo } from "./init/info.js";

export function init() {
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initTabs();

    fetchInfo();
    fetchFormation();
  });
}
