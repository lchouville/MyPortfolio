export const initTheme = () =>{
    // Gestion du sélecteur de thème
    const themeToggle = document.getElementById("themeToggle");
    const themeMenu = document.getElementById("themeMenu");
    const themeOptions = document.querySelectorAll(".theme-option");

    // Changer de thème
    themeOptions.forEach((option) => {
      option.addEventListener("click", () => {
        themeOptions.forEach((opt) => opt.classList.remove("active"));
        option.classList.add("active");

        const selectedTheme = option.getAttribute("data-theme");
        if (selectedTheme === "light") {
          document.body.removeAttribute("data-theme");
        } else {
          document.body.setAttribute("data-theme", selectedTheme);
        }

        themeMenu.classList.remove("show");
      });
    });
    
    // Afficher/masquer le menu des thèmes
    themeToggle.addEventListener("click", () => {
      themeMenu.classList.toggle("show");
    });

    // Fermer le menu si on clique ailleurs
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".theme-selector")) {
        themeMenu.classList.remove("show");
      }
    });
}