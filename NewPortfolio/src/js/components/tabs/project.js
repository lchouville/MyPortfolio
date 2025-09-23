import { loadData } from "../../functions/data.js";
import { createSkillsTags } from "../../functions/tags.js";
import { loadTemplate } from "../../functions/templates.js";

// Generate a random pastel color for placeholders
const getRandomPastelColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 40 + Math.floor(Math.random() * 30); // 40–70%
  const lightness = 60 + Math.floor(Math.random() * 30);  // 60–90%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// Map project status → CSS class
const STATUS_CLASSES = {
  "Terminé": "finished",
  "En cours": "in-progress",
  "En pause": "paused",
  "Annulé": "aborted",
  "": "no-status"
};

// Create technology tags
const createTechTags = (techList) => {
  const wrapper = document.createElement("div");
  wrapper.classList.add("project-tags");

  [...techList]
    .sort((a, b) => a.length - b.length) // shortest first
    .forEach((tech) => {
      const tag = document.createElement("span");
      tag.classList.add("project-tag");
      tag.textContent = tech;
      wrapper.appendChild(tag);
    });

  return wrapper;
};

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
function populateProjects(projectsData, projectCardTmpl, errors,skills) {
  const projectsGrid = document.getElementById("projects-grid");
  if (!projectsGrid) {
    console.error(errors.grid404);
    return;
  }

  projectsData.forEach((project) => {
    const projectCard = document.createElement("div");
    projectCard.id = project.name.replace(/\s+/g, "-");
    projectCard.classList.add("project-card");

    // Fill template placeholders
    projectCard.innerHTML = projectCardTmpl
      .replace(/{{status}}/g, project.status || "")
      .replace(/{{projectName}}/g, project.name || "")
      .replace(/{{projectDesc}}/g, project.description || "");

    // Apply status class
    const statusSpan = projectCard.querySelector(".project-status");
    const statusClass = STATUS_CLASSES[project.status] || "no-status";
    statusSpan.classList.add(statusClass);

    // Dans populateProjects
    if (Array.isArray(project.hardSkills) && project.hardSkills.length > 0) {
      projectCard.appendChild(
        createSkillsTags(project.hardSkills, skills.hardSkills, "tag-hard-skill")
      );
    }

    // if (Array.isArray(project.softSkills) && project.softSkills.length > 0) {
    //   projectCard.appendChild(
    //     createSkillsTags(project.softSkills, skills.softSkills, "tag-soft-skill")
    //   );
    // }

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
    const [projectsResponse, projectCardTmpl, errors, skills] = await Promise.all([
      fetch("src/asset/data/projects.json"),
      loadTemplate("./src/template/tabs/projectCard.tmpl"),
      loadData("src/asset/data/error.json"),
      loadData("src/asset/data/skills.json"),
    ]);

    const projectsData = await projectsResponse.json();
    populateProjects(projectsData, projectCardTmpl, errors, skills);
  } catch (error) {
    console.error("Error while loading projects:", error);
  }
};
