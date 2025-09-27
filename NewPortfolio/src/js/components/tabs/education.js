import { loadData } from "../../functions/data.js";
import { createSkillsTags, createTagsList } from "../../functions/tags.js";
import { loadTemplate } from "../../functions/templates.js";
import { normalizeSkillsData } from "../../functions/utils-skills.js";

// Populate the education timeline with items
function populateEducation(educationData, formationTmpl, errors, skills) {
  const parcoursTab = document.getElementById("parcours-tab");
  const timeline = parcoursTab?.querySelector(".timeline");

  if (!timeline) {
    console.error(
      errors.timeline404 ||
        "The .timeline element was not found inside #parcours-tab."
    );
    return;
  }

  // Normalize skills data to work with both old and new structure
  const normalizedSkills = normalizeSkillsData(skills);

  educationData.forEach((item) => {
    const timelineItem = document.createElement("div");
    timelineItem.classList.add("timeline-item");

    // Format dates + mention
    let dateText = item.obtention.dateDebut || "";
    if (item.obtention.dateFin) {
      dateText += ` - ${item.obtention.dateFin}`;
    }
    const mentionText = item.obtention.mention
      ? ` — ${item.obtention.mention}`
      : "";

    // Fill template placeholders
    timelineItem.innerHTML = formationTmpl
      .replace(/{{title}}/g, item.title || "")
      .replace(
        /{{school}}/g,
        item.school + (item.location ? ` (${item.location})` : "")
      )
      .replace(/{{dates}}/g, `${dateText}${mentionText}`)
      .replace(/{{description}}/g, item.description || "");

    // Add skills if present
    if (item.hardSkills?.length > 0 || item.softSkills?.length > 0) {
      const skillsContainer = document.createElement("div");
      skillsContainer.classList.add("skills-container");

      if (item.hardSkills?.length > 0) {
        const hardSkillsTitle = document.createElement("h4");
        hardSkillsTitle.textContent = "Compétences Techniques";
        hardSkillsTitle.classList.add("skills-title");
        skillsContainer.appendChild(hardSkillsTitle);

        // Use normalized skills data
        skillsContainer.appendChild(
          createSkillsTags(item.hardSkills, normalizedSkills.flat.hardSkills, "tag-hard-skill")
        );
      }

      if (item.softSkills?.length > 0) {
        const softSkillsTitle = document.createElement("h4");
        softSkillsTitle.textContent = "Compétences Transversales";
        softSkillsTitle.classList.add("skills-title");
        skillsContainer.appendChild(softSkillsTitle);

        // Use normalized skills data
        skillsContainer.appendChild(
          createSkillsTags(item.softSkills, normalizedSkills.flat.softSkills, "tag-soft-skill", true)
        );
      }

      timelineItem
        .querySelector(".timeline-content")
        .appendChild(skillsContainer);
    }

    timeline.appendChild(timelineItem);
  });
}

// Fetch and render education timeline
export const fetchEducation = async () => {
  try {
    const [educationResponse, formationTmpl, errors, skills] =
      await Promise.all([
        fetch("src/asset/data/education.json"),
        loadTemplate("./src/template/tabs/educationCard.tmpl"),
        loadData("src/asset/data/error.json"),
        loadData("src/asset/data/skills.json"),
      ]);

    const educationData = await educationResponse.json();
    populateEducation(educationData, formationTmpl, errors, skills);
  } catch (error) {
    console.error("Error while loading education.json:", error);
  }
};
