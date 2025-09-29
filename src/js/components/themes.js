export const initTheme = () => {
  const themeToggle = document.getElementById("themeToggle");
  const themeMenu = document.getElementById("themeMenu");
  const themeOptions = document.querySelectorAll(".theme-option");

  // Apply a Theme
  const applyTheme = (theme) => {
    themeOptions.forEach((opt) => opt.classList.remove("active"));
    const selectedOption = Array.from(themeOptions).find(
      (opt) => opt.getAttribute("data-theme") === theme
    );
    if (selectedOption) selectedOption.classList.add("active");

    document.documentElement.setAttribute("data-theme", theme);

    localStorage.setItem("selectedTheme", theme);
  };

  // Load the saved theme or default
  const savedTheme = localStorage.getItem("selectedTheme") || "shire";
  applyTheme(savedTheme);

  // Click Behaviour on option
  themeOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const theme = option.getAttribute("data-theme");
      applyTheme(theme);
      themeMenu.classList.remove("show");
    });
  });

  // Toggle menu (with animation)
  themeToggle.addEventListener("click", () => {
    themeMenu.classList.toggle("show");
  });

  // Close menu on outside click
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".theme-selector")) {
      themeMenu.classList.remove("show");
    }
  });
};
