import { loadData } from "../../functions/data.js";
import { loadTemplate } from "../../functions/templates.js";

// Generate a random pastel color for placeholders
const getRandomPastelColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 30) + 40; // 40–70%
  const lightness = Math.floor(Math.random() * 30) + 60;  // 60–90%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// Build project cards and append them to the grid
function populateProjects(projectsData, projectCardTmpl, errors) {
  const projectsGrid = document.getElementById("projects-grid");
  if (!projectsGrid) {
    console.error(errors.grid404);
    return;
  }

  projectsData.forEach((project) => {
    // Card container
    const projectCard = document.createElement("div");
    projectCard.id = project.name.replace(/\s+/g, "-"); // safer for multiple spaces
    projectCard.classList.add("project-card");

    // Replace placeholders in the template
    projectCard.innerHTML = projectCardTmpl
      .replace(/{{status}}/g, project.status || "")
      .replace(/{{projectName}}/g, project.name || "")
      .replace(/{{projectDesc}}/g, project.description || "");

    // Add technology tags if any
    if (Array.isArray(project.techno) && project.techno.length > 0) {
      const projectTags = document.createElement("div");
      projectTags.classList.add("project-tags");

      project.techno.forEach((tech) => {
        const tag = document.createElement("span");
        tag.classList.add("project-tag");
        tag.textContent = tech;
        projectTags.appendChild(tag);
      });

      projectCard.appendChild(projectTags);
    }

    // Set image or fallback pastel color
    const projectImageDiv = projectCard.querySelector(".project-image"); // class instead of ID
    if (projectImageDiv) {
      if (project.image) {
        projectImageDiv.style.backgroundImage = `url('${project.image}')`;
      } else {
        projectImageDiv.style.backgroundColor = getRandomPastelColor();
      }
    }

    // Append card to grid
    projectsGrid.appendChild(projectCard);
  });
}

// Fetch and render projects
export const fetchProjects = async () => {
  try {
    const [projectsResponse, projectCardTmpl, errors] = await Promise.all([
      fetch("src/asset/data/projects.json"),
      loadTemplate("./src/template/tabs/projectCard.tmpl"),
      loadData("src/asset/data/error.json"),
    ]);

    const projectsData = await projectsResponse.json();
    populateProjects(projectsData, projectCardTmpl, errors);
  } catch (error) {
    console.error("Error while loading projects:", error);
  }
};
