import { mergeSkills } from "../function/skills.js";
import { extractSkillsFromFormations } from "./formation.js";
import { extractSkillsFromProjects } from "./project.js";

// Select the about-me section from the DOM
const aboutMeSection = document.getElementById("about-me");

/**
 * Helper function to create a section with a title and a list of tags
 * @param {string} titleText - The section title
 * @param {Array} items - Array of items to display as tags
 * @param {string} itemClass - CSS class name for the container and tags
 * @returns {HTMLElement} - The complete section element
 */
const createSection = (titleText, items, itemClass) => {
  const section = document.createElement("div");

  const title = document.createElement("h1");
  title.textContent = titleText;
  section.appendChild(title);

  const list = document.createElement("div");
  list.classList.add('competences-tags');

  // Create each tag and append it to the list
  items.forEach(competence => {
    const tag = document.createElement('span');
    tag.classList.add('competence-tag', itemClass);
    tag.textContent = competence;
    list.appendChild(tag);
  });
  section.appendChild(list);
  return section;
};

/**
 * Populate the about-me section with data
 * @param {Object} aboutMeData - JSON data containing title, about me text, skills and interests
 */
const populateAboutMe = (aboutMeData, mergedSkills) => {
  if (!aboutMeSection) {
    console.error("The #about-me element was not found.");
    return;
  }

  // Create the main title
  const title = document.createElement("h1");
  title.textContent = aboutMeData.title;

  // Create the 'About Me' paragraph
  const aboutMeText = document.createElement("p");
  aboutMeText.textContent = aboutMeData.about_me;

  // Create the skills section (hard skills + soft skills)
  const skillsSection = document.createElement("div");
  skillsSection.classList.add("skills");

  skillsSection.appendChild(
    createSection("Compétences Techniques", mergedSkills.hard_skills, "hard-skill-tag")
  );
  skillsSection.appendChild(
    createSection("Compétences Relationnelles", mergedSkills.soft_skills, "soft-skill-tag")
  );

  // Create the interests section
  const interestsSection = createSection(
    "Centres d'intérêt",
    aboutMeData.interests,
    "interests-tag"
  );

  // Append everything to the about-me section
  aboutMeSection.append(title, aboutMeText, skillsSection, interestsSection);
};

/**
 * Populate the about-me section using already-fetched formation and projects data
 * @param {Array} formationData - Parsed formation.json data
 * @param {Array} projectsData - Parsed projects.json data
 */
export const fetchAboutMe = async (formationData, projectsData) => {
  const educationSkills = formationData
    ? extractSkillsFromFormations(formationData)
    : { hard_skills: [], soft_skills: [] };
  const projectSkills = projectsData
    ? extractSkillsFromProjects(projectsData)
    : { hard_skills: [], soft_skills: [] };
  const mergedSkills = mergeSkills(educationSkills, projectSkills)
  try {
    const aboutMeResponse = await fetch("data/personalInfo.json");
    const aboutMeData = await aboutMeResponse.json();
    populateAboutMe(aboutMeData, mergedSkills);
  } catch (error) {
    console.error("Error loading about_me.json file:", error);
  }
};
