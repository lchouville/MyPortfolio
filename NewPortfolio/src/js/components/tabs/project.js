import { loadData } from "../../functions/data.js";
import { createSkillsTags } from "../../functions/tags.js";
import { loadTemplate } from "../../functions/templates.js";

// Generate a random pastel color for placeholders
const getRandomPastelColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 40 + Math.floor(Math.random() * 30); // 40-70%
  const lightness = 60 + Math.floor(Math.random() * 30);  // 60-90%
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

// Helper function to normalize skills data (works with both old and new structure)
function normalizeSkillsData(skillsData) {
  const normalized = {};

  if (!skillsData) return normalized;

  // Process hardSkills
  if (skillsData.hardSkills) {
    normalized.hardSkills = {};
    for (const [category, items] of Object.entries(skillsData.hardSkills)) {
      // Check if it's the new structure with 'items' array
      if (items.items) {
        normalized.hardSkills[category] = items.items;
      } else if (Array.isArray(items)) {
        // Old structure - keep as is
        normalized.hardSkills[category] = items;
      }
    }
  }

  // Process softSkills
  if (skillsData.softSkills) {
    normalized.softSkills = {};
    for (const [category, items] of Object.entries(skillsData.softSkills)) {
      // Check if it's the new structure with 'items' array
      if (items.items) {
        normalized.softSkills[category] = items.items;
      } else if (Array.isArray(items)) {
        // Old structure - keep as is
        normalized.softSkills[category] = items;
      }
    }
  }

  return normalized;
}

// Build project cards and append them to the grid
function populateProjects(projectsData, projectCardTmpl, errors, skills) {
  const projectsGrid = document.getElementById("projects-grid");
  if (!projectsGrid) {
    console.error(errors.grid404 || "Projects grid not found");
    return;
  }

  // Normalize skills data to work with both old and new structure
  const normalizedSkills = normalizeSkillsData(skills);

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
    if (statusSpan) {
      const statusClass = STATUS_CLASSES[project.status] || "no-status";
      statusSpan.classList.add(statusClass);
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
        createSkillsTags(project.hardSkills, normalizedSkills.hardSkills, "tag-hard-skill")
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
