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
    if (formation.competences && formation.competences.length > 0) {
      const competencesTags = document.createElement('div');
      competencesTags.classList.add('competences-tags');
      formation.competences.sort(); // Trier les compétences alphabétiquement (optionnel)
      formation.competences.forEach(competence => {
        const tag = document.createElement('span');
        tag.classList.add('competence-tag');
        tag.textContent = competence;
        competencesTags.appendChild(tag);
      });
      timelineContent.appendChild(competencesTags);
    }

    timelineItem.appendChild(timelineContent);
    timeline.appendChild(timelineItem);
  });
};

export const fetchFormation = async () => {
  try {
    const educationResponse = await fetch("data/formation.json");
    const educationData = await educationResponse.json();
    populateEducation(educationData);
  } catch (error) {
    console.error(
      "Erreur lors du chargement du fichier education.json:",
      error
    );
  }
};

