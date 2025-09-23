import { loadData } from "../../functions/data.js";
import { createTagsList } from "../../functions/tags.js";
import { loadTemplate } from "../../functions/templates.js";

// Populate the education timeline with items
function populateEducation(educationData, formationTmpl, errors) {
    const parcoursTab = document.getElementById("parcours-tab");
    const timeline = parcoursTab?.querySelector(".timeline");

    if (!timeline) {
        console.error(errors.timeline404 || "The .timeline element was not found inside #parcours-tab.");
        return;
    }

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
        if (item.competences) {
            const skillsContainer = document.createElement("div");
            skillsContainer.classList.add("skills-container");

            if (item.competences.hard_skills?.length > 0) {
                const hardSkillsTitle = document.createElement("h4");
                hardSkillsTitle.textContent = "Hard Skills";
                hardSkillsTitle.classList.add("skills-title");
                skillsContainer.appendChild(hardSkillsTitle);
                skillsContainer.appendChild(
                    createTagsList(item.competences.hard_skills, "tag-hard-skill")
                );
            }

            if (item.competences.soft_skills?.length > 0) {
                const softSkillsTitle = document.createElement("h4");
                softSkillsTitle.textContent = "Soft Skills";
                softSkillsTitle.classList.add("skills-title");
                skillsContainer.appendChild(softSkillsTitle);
                skillsContainer.appendChild(
                    createTagsList(item.competences.soft_skills, "tag-soft-skill")
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
        const [educationResponse, formationTmpl, errors] = await Promise.all([
            fetch("src/asset/data/education.json"),
            loadTemplate("./src/template/tabs/educationCard.tmpl"),
            loadData("src/asset/data/error.json"),
        ]);

        const educationData = await educationResponse.json();
        populateEducation(educationData, formationTmpl, errors);
    } catch (error) {
        console.error("Error while loading education.json:", error);
    }
};