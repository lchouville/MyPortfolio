export const initTheme = () => {
    // Gestion du sélecteur de thème
    const themeToggle = document.getElementById("themeToggle");
    const themeMenu = document.getElementById("themeMenu");
    const themeOptions = document.querySelectorAll(".theme-option");

    // Fonction pour appliquer un thème
    const applyTheme = (theme) => {
        themeOptions.forEach((opt) => opt.classList.remove("active"));
        const selectedOption = Array.from(themeOptions).find(option => option.getAttribute("data-theme") === theme);
        if (selectedOption) {
            selectedOption.classList.add("active");
        }
    
        if (theme === "light") {
            document.body.removeAttribute("data-theme");
        } else if (theme === "auto") {
            const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            document.body.setAttribute("data-theme", preferredTheme);
            // Mettre à jour l'option "auto" si elle existe
            const autoOption = Array.from(themeOptions).find(option => option.getAttribute("data-theme") === "auto");
            if (autoOption) {
                autoOption.textContent = `Auto (${preferredTheme})`;
            }
        } else {
            document.body.setAttribute("data-theme", theme);
        }
    };

    // Détecter la préférence du navigateur au chargement
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    const handleThemePreferenceChange = (event) => {
        const preferredTheme = event.matches ? "dark" : "light";
        applyTheme(preferredTheme);

        // Mettre à jour l'option "auto" si elle existe
        const autoOption = Array.from(themeOptions).find(option => option.getAttribute("data-theme") === "auto");
        if (autoOption) {
            autoOption.textContent = `Auto (${preferredTheme})`;
        }
    };

    // Écouter les changements de préférence
    prefersDarkScheme.addEventListener("change", handleThemePreferenceChange);

    // Appliquer le thème initial basé sur la préférence du navigateur
    handleThemePreferenceChange(prefersDarkScheme);

    // Changer de thème via le menu
    themeOptions.forEach((option) => {
        option.addEventListener("click", () => {
            const selectedTheme = option.getAttribute("data-theme");
            applyTheme(selectedTheme);
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
};