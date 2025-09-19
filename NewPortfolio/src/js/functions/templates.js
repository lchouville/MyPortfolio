export const loadTemplate = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error("Erreur lors du chargement du template :", error);
    return `<div class="error">Impossible de charger le sélecteur de thème.</div>`;
  }
};