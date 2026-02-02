import { loadData } from "../../functions/data.js";
import { createSkillsTags } from "../../functions/tags.js";
import { loadTemplate } from "../../functions/templates.js";
import { normalizeSkillsData } from "../../functions/utils-skills.js";

// Populate the professional experiences section
function populateExperience(experienceData, experienceTmpl, errors, skills) {
    const professionalTab = document.getElementById("professional-tab");
    if (!professionalTab) {
        console.error(errors.experience404 || "The #professional-tab element was not found.");
        return;
    }

    // Normalize skills data to work with both old and new structure
    const normalizedSkills = normalizeSkillsData(skills);

    experienceData.forEach((exp) => {
        const experienceItem = document.createElement("div");
        experienceItem.classList.add("experience-item");

        // Format dates
        const startDate = exp.startDate || "";
        const endDate = exp.endDate || "Present";
        const duration = exp.duration || "";

        // Fill template placeholders
        experienceItem.innerHTML = experienceTmpl
            .replace(/{{title}}/g, exp.title || "")
            .replace(
                /{{company}}/g,
                exp.company + (exp.location ? ` (${exp.location})` : "")
            )
            .replace(/{{dates}}/g, `${startDate} - ${endDate}`)
            .replace(/{{duration}}/g, duration)
            .replace(/{{description}}/g, exp.description || "");

        // Add skills if any
        if (Array.isArray(exp.hardSkills) && exp.hardSkills.length > 0) {
            const hardSkillsContainer = document.createElement("div");
            hardSkillsContainer.classList.add("skills-container");

            const hardSkillsTitle = document.createElement("h4");
            hardSkillsTitle.textContent = "Compétences Techniques";
            hardSkillsTitle.classList.add("skills-title");
            hardSkillsContainer.appendChild(hardSkillsTitle);

            hardSkillsContainer.appendChild(
                createSkillsTags(exp.hardSkills, normalizedSkills.flat.hardSkills, "tag-hard-skill")
            );

            experienceItem.appendChild(hardSkillsContainer);
        }

        if (Array.isArray(exp.softSkills) && exp.softSkills.length > 0) {
            const softSkillsContainer = document.createElement("div");
            softSkillsContainer.classList.add("skills-container");

            const softSkillsTitle = document.createElement("h4");
            softSkillsTitle.textContent = "Compétences Transversales";
            softSkillsTitle.classList.add("skills-title");
            softSkillsContainer.appendChild(softSkillsTitle);

            softSkillsContainer.appendChild(
                createSkillsTags(exp.softSkills, normalizedSkills.flat.softSkills, "tag-soft-skill", true)
            );

            experienceItem.appendChild(softSkillsContainer);
        }

        professionalTab.appendChild(experienceItem);
    });
}

// Fetch and render experiences
export const fetchExperience = async () => {
    try {
        const [experienceResponse, experienceTmpl, errors, skills] = await Promise.all([
            fetch("src/asset/data/experience.json"),
            loadTemplate("./src/template/tabs/experienceCard.tmpl"),
            loadData("src/asset/data/error.json"),
            loadData("src/asset/data/skills.json")
        ]);

        const experienceData = await experienceResponse.json();
        populateExperience(experienceData, experienceTmpl, errors, skills);
    } catch (error) {
        console.error("Error while loading experience.json:", error);
    }
};
