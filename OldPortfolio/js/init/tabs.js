export const initTabs = () => {
  // Gestion des onglets
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Désactiver tous les onglets
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Activer l'onglet cliqué
      button.classList.add("active");
      const tabId = button.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");
    });
  });
  initSkillSubTabs()
};

function initSkillSubTabs() {
  const subTabButtons = document.querySelectorAll('.sub-tab-btn');
  const subTabContents = document.querySelectorAll('.sub-tab-content');

  subTabButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const target = btn.getAttribute('data-subtab');

      subTabContents.forEach((content) => {
        content.style.display = 'none';
      });

      subTabButtons.forEach((b) => b.classList.remove('active'));

      document.getElementById(target).style.display = 'block';
      btn.classList.add('active');
    });
  });

  // Activer la première sous-tab par défaut
  if (subTabButtons.length > 0) subTabButtons[0].click();
}