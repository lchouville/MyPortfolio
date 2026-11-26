import { toSortedSkillSets } from "../function/skills.js";

const parcoursTab = document.getElementById("parcours-tab");
const timeline = parcoursTab.querySelector(".timeline");

const populateEducation = (educationData) => {
  if (!timeline) {
    console.error("L'élément .timeline n'a pas été trouvé dans #parcours-tab.");
    return;
  }

  educationData.forEach((formation) => {
    const timelineItem = document.createElement("div");
    timelineItem.classList.add("timeline-item");

    const timelineContent = document.createElement("div");
    timelineContent.classList.add("timeline-content");

    const title = document.createElement("h3");
    title.textContent = formation.intitule; // Intitulé de la formation

    const school = document.createElement("p");
    school.classList.add("school");
    school.textContent =
      formation.ecole + (formation.location ? ` (${formation.location})` : ""); // Nom de l'école

    const obtention = document.createElement("p");
    obtention.classList.add("obtention");
    let dateText = formation.obtention.dateDebut
      ? formation.obtention.dateDebut.replace(/-0?$/, "")
      : "";
    if (formation.obtention.dateFin) {
      dateText += ` - ${formation.obtention.dateFin.replace(/-0?$/, "")}`;
    }
    const mentionText = formation.obtention.mention
      ? ` — ${formation.obtention.mention}`
      : ""; // Mention avec un tiret em dash
    obtention.textContent = `${dateText}${mentionText}`;

    const descriptionParagraph = document.createElement("p");
    descriptionParagraph.classList.add("description");
    descriptionParagraph.textContent = formation.description || ""; // Description

    // Construction de la structure HTML
    timelineContent.appendChild(title);
    timelineContent.appendChild(school);
    timelineContent.appendChild(obtention);
    timelineContent.appendChild(descriptionParagraph);

    // Ajout des compétences avec effet d'animation
    if (formation.competences) {
      const competencesContainer = document.createElement('div');
      competencesContainer.classList.add('competences-container');

      // Ajouter les hard skills si elles existent
      if (formation.competences.hard_skills && formation.competences.hard_skills.length > 0) {
        const hardSkillsTitle = document.createElement('h4');
        hardSkillsTitle.textContent = 'Hard Skills';
        hardSkillsTitle.classList.add('competences-title');
        competencesContainer.appendChild(hardSkillsTitle);

        const hardSkillsTags = document.createElement('div');
        hardSkillsTags.classList.add('competences-tags');

        formation.competences.hard_skills.sort(); // Trier les compétences alphabétiquement
        formation.competences.hard_skills.forEach(competence => {
          const tag = document.createElement('span');
          tag.classList.add('competence-tag', 'hard-skill-tag');
          tag.textContent = competence;
          hardSkillsTags.appendChild(tag);
        });

        competencesContainer.appendChild(hardSkillsTags);
      }

      // Ajouter les soft skills si elles existent
      if (formation.competences.soft_skills && formation.competences.soft_skills.length > 0) {
        const softSkillsTitle = document.createElement('h4');
        softSkillsTitle.textContent = 'Soft Skills';
        softSkillsTitle.classList.add('competences-title');
        competencesContainer.appendChild(softSkillsTitle);

        const softSkillsTags = document.createElement('div');
        softSkillsTags.classList.add('competences-tags');

        formation.competences.soft_skills.sort(); // Trier les compétences alphabétiquement
        formation.competences.soft_skills.forEach(competence => {
          const tag = document.createElement('span');
          tag.classList.add('competence-tag', 'soft-skill-tag');
          tag.textContent = competence;
          softSkillsTags.appendChild(tag);
        });

        competencesContainer.appendChild(softSkillsTags);
      }

      timelineContent.appendChild(competencesContainer);
    }


    timelineItem.appendChild(timelineContent);
    timeline.appendChild(timelineItem);
  });
};

export const fetchFormation = (educationData) => {
  if (!educationData) return;
  populateEducation(educationData);
};


/**
 * Extrait les compétences (hard_skills et soft_skills) depuis le JSON des formations.
 * @param {Array} formations - Tableau des formations au format JSON.
 * @returns {Object} - Objet avec deux tableaux : hard_skills et soft_skills.
 */
export function extractSkillsFromFormations(formations) {
  return toSortedSkillSets(formations, (formation) => formation.competences);
}