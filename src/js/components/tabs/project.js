import { loadData } from "../../functions/data.js";
import { createSkillsTags } from "../../functions/tags.js";
import { loadTemplate } from "../../functions/templates.js";
import { getRandomPastelColor, normalizeSkillsData } from "../../functions/utils-skills.js";

// Create project links (view project / view code)
const createProjectLinks = (access, repository) => {
  const linksWrapper = document.createElement("div");
  linksWrapper.classList.add("project-links");
  if (access) {
    const accessLink = document.createElement("a");
    accessLink.href = access;
    accessLink.textContent = "Voir le projet";
    accessLink.target = "_blank";
    linksWrapper.appendChild(accessLink);
  }
  if (repository) {
    const repoLink = document.createElement("a");
    repoLink.href = repository;
    repoLink.textContent = "Voir le code";
    repoLink.target = "_blank";
    linksWrapper.appendChild(repoLink);
  }
  return linksWrapper;
};

// Build project cards and append them to the grid
function populateProjects(projectsData, projectCardTmpl, errors, skills, siteData) {
  const projectsGrid = document.getElementById("projects-grid");
  if (!projectsGrid) {
    console.error(errors.grid404 || "Projects grid not found");
    return;
  }

  // Normalize skills data
  const normalizedSkills = normalizeSkillsData(skills);
  
  // Get status translations from site data
  const statusTranslations = siteData?.tabs?.["projects-status"] || {};

  projectsData.forEach((project) => {
    const projectCard = document.createElement("div");
    projectCard.id = project.name.replace(/\s+/g, "-");
    projectCard.classList.add("project-card");

    // Get translated status label
    const statusKey = project.status || "";
    const statusLabel = statusTranslations[statusKey] || statusKey;
    console.log(statusKey," : ",statusLabel)
    // Fill template placeholders
    projectCard.innerHTML = projectCardTmpl
      .replace(/{{status}}/g, statusLabel)
      .replace(/{{projectName}}/g, project.name || "")
      .replace(/{{projectDesc}}/g, project.description || "");

    // Apply status class directly from the status key
    const statusSpan = projectCard.querySelector(".project-status");
    if (statusSpan && statusKey) {
      statusSpan.classList.add(`status-${statusKey}`);
    }

    // Add skills if present
    if (Array.isArray(project.hardSkills) && project.hardSkills.length > 0) {
      const skillsContainer = document.createElement("div");
      skillsContainer.classList.add("project-skills");

      const skillsTitle = document.createElement("h4");
      skillsTitle.textContent = "Technologies utilisées";
      skillsTitle.classList.add("skills-title");
      skillsContainer.appendChild(skillsTitle);

      skillsContainer.appendChild(
        createSkillsTags(project.hardSkills, normalizedSkills.flat.hardSkills, "tag-hard-skill")
      );

      projectCard.appendChild(skillsContainer);
    }

    // Handle project image or fallback color
    const projectImageDiv = projectCard.querySelector(".project-image");
    if (projectImageDiv) {
      projectImageDiv.style.backgroundImage = project.image
        ? `url('${project.image}')`
        : "none";
      if (!project.image) {
        projectImageDiv.style.backgroundColor = getRandomPastelColor();
      }
    }

    // Add links
    projectCard.appendChild(
      createProjectLinks(project.access, project.repository)
    );

    // Add card to grid
    projectsGrid.appendChild(projectCard);
  });
}

// Fetch and render projects
export const fetchProjects = async () => {
  try {
    const [projectsResponse, projectCardTmpl, errors, skills, siteData] = await Promise.all([
      fetch("src/asset/data/projects.json"),
      loadTemplate("./src/template/tabs/projectCard.tmpl"),
      loadData("src/asset/data/error.json"),
      loadData("src/asset/data/skills.json"),
      loadData("src/asset/data/site.json"), // Votre fichier avec les traductions
    ]);

    const projectsData = await projectsResponse.json();
    populateProjects(projectsData, projectCardTmpl, errors, skills, siteData);
  } catch (error) {
    console.error("Error while loading projects:", error);
  }
};