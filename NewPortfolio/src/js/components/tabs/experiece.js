import { loadData } from "../../functions/data.js";
import { createTagsList } from "../../functions/tags.js";
import { loadTemplate } from "../../functions/templates.js";

// Populate the professional experiences section
function populateExperience(experienceData, experienceTmpl, errors) {
    const professionalTab = document.getElementById("professional-tab");
    const experienceContainer = professionalTab;

    if (!experienceContainer) {
        console.error(errors.experience404 || "The #professional-tab element was not found.");
        return;
    }

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
        if (Array.isArray(exp.skills) && exp.skills.length > 0) {
            const skillsContainer = document.createElement("div");
            skillsContainer.classList.add("skills-container");

            const SkillsTitle = document.createElement("h4");
            SkillsTitle.textContent = "Skills";
            SkillsTitle.classList.add("skills-title");

            skillsContainer.appendChild(
                createTagsList(exp.skills, "tag-hard-skill")
            );
            experienceItem.appendChild(skillsContainer);

        }

        experienceContainer.appendChild(experienceItem);
    });
}

// Fetch and render experiences
export const fetchExperience = async () => {
    try {
        const [experienceResponse, experienceTmpl, errors] = await Promise.all([
            fetch("src/asset/data/experience.json"),
            loadTemplate("./src/template/tabs/experienceCard.tmpl"),
            loadData("src/asset/data/error.json"),
        ]);

        const experienceData = await experienceResponse.json();
        populateExperience(experienceData, experienceTmpl, errors);
    } catch (error) {
        console.error("Error while loading experience.json:", error);
    }
};
