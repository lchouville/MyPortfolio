export const initTheme = () => {
  const themeToggle = document.getElementById("themeToggle");
  const themeMenu = document.getElementById("themeMenu");
  const themeOptions = document.querySelectorAll(".theme-option");

  // Applique un thème
  const applyTheme = (theme) => {
    themeOptions.forEach(opt => opt.classList.remove("active"));
    const selectedOption = Array.from(themeOptions).find(
      opt => opt.getAttribute("data-theme") === theme
    );
    if (selectedOption) selectedOption.classList.add("active");

    // ✅ Ici : document.documentElement plutôt que body
    document.documentElement.setAttribute("data-theme", theme);

    localStorage.setItem("selectedTheme", theme);
  };

  // Charge le thème sauvegardé ou par défaut
  const savedTheme = localStorage.getItem("selectedTheme") || "shire";
  applyTheme(savedTheme);

  // Gestion des clics sur les options
  themeOptions.forEach(option => {
    option.addEventListener("click", () => {
      const theme = option.getAttribute("data-theme");
      applyTheme(theme);
      themeMenu.classList.remove("show");
    });
  });

  // Toggle du menu (avec animation)
  themeToggle.addEventListener("click", () => {
    themeMenu.classList.toggle("show");
  });

  // Ferme le menu si clic à l'extérieur
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".theme-selector")) {
      themeMenu.classList.remove("show");
    }
  });
};
