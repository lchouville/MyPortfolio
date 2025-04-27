const projetsTab = document.getElementById("projets-tab");
const projectsGrid = projetsTab.querySelector(".projects-grid");

const getRandomPastelColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 30) + 40; // Saturation entre 40% et 70% pour des couleurs peu saturées
  const lightness = Math.floor(Math.random() * 30) + 60; // Lightness entre 60% et 90% pour des couleurs claires
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const populateProjects = (projectsData) => {
  if (!projectsGrid) {
    console.error(
      "L'élément .projects-grid n'a pas été trouvé dans #projets-tab."
    );
    return;
  }

  projectsData.forEach((project) => {
    const projectCard = document.createElement("div");
    projectCard.classList.add("project-card");

    const projectImageDiv = document.createElement("div");
    projectImageDiv.classList.add("project-image");
    if (project.image) {
      projectImageDiv.style.backgroundImage = `url('${project.image}')`;
    } else {
      projectImageDiv.style.backgroundColor = getRandomPastelColor();
    }

    const projectContent = document.createElement("div");
    projectContent.classList.add("project-content");

    const title = document.createElement("h3");
    title.textContent = project.name || "Nom du Projet";

    const description = document.createElement("p");
    description.textContent =
      project.description || "Description du projet non disponible.";

    const projectTags = document.createElement("div");
    projectTags.classList.add("project-tags");
    if (project.techno && project.techno.length > 0) {
      project.techno.forEach((tech) => {
        const tag = document.createElement("span");
        tag.classList.add("project-tag");
        tag.textContent = tech;
        projectTags.appendChild(tag);
      });
    }

    const projectLinks = document.createElement("div");
    projectLinks.classList.add("project-links");
    let repoLink = null;
    if (project.access) {
      const accessLink = document.createElement("a");
      accessLink.href = project.access;
      accessLink.textContent = "Voir le projet";
      accessLink.target = "_blank";
      projectLinks.appendChild(accessLink);
    }
    if (project.repository) {
      repoLink = document.createElement("a");
      repoLink.href = project.repository;
      repoLink.textContent = "Voir le code";
      repoLink.target = "_blank";
      projectLinks.appendChild(repoLink);
    }

    const statusSpan = document.createElement("span");
    statusSpan.classList.add("project-status");
    statusSpan.textContent = project.status || "Statut inconnu";
    switch (project.status) {
      case "Terminé":
        statusSpan.classList.add("finished");
        break;
      case "En cours":
        statusSpan.classList.add("in-progress");
        break;
      case "En pause":
        statusSpan.classList.add("paused");
        break;
      case "Annulé":
        statusSpan.classList.add("aborted");
        break;
      default:
        statusSpan.classList.add("no-status");
        break;
    }

    projectCard.appendChild(projectImageDiv);
    projectCard.appendChild(statusSpan); // Ajout du statut en dehors de projectContent

    projectContent.appendChild(title);
    projectContent.appendChild(description);
    projectContent.appendChild(projectTags);
    if (repoLink) {
      projectContent.appendChild(projectLinks); // Ajout des liens dans le contenu
    }

    projectCard.appendChild(projectContent);
    projectsGrid.appendChild(projectCard);
  });
};

export const fetchProjects = async () => {
  try {
    const projectsResponse = await fetch("data/projects.json");
    const projectsData = await projectsResponse.json();
    populateProjects(projectsData);
  } catch (error) {
    console.error("Erreur lors du chargement du fichier projects.json:", error);
  }
};
