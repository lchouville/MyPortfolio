const professionnelTab = document.getElementById('professionnel-tab');
  const experienceContainer = professionnelTab; // On utilise directement le tab comme conteneur

  const populateExperience = (experienceData) => {
    if (!experienceContainer) {
      console.error("L'élément #professionnel-tab n'a pas été trouvé.");
      return;
    }

    experienceData.forEach(experience => {
      const experienceItem = document.createElement('div');
      experienceItem.classList.add('experience-item');

      const experienceHeader = document.createElement('div');
      experienceHeader.classList.add('experience-header');

      const headerLeft = document.createElement('div');

      const title = document.createElement('h3');
      title.classList.add('experience-title');
      title.textContent = experience.title;

      const company = document.createElement('div');
      company.classList.add('experience-company');
      company.textContent = experience.company + (experience.location ? ` (${experience.location})` : '');

      headerLeft.appendChild(title);
      headerLeft.appendChild(company);

      const dateDurationDiv = document.createElement('div');
      dateDurationDiv.classList.add('experience-date-duration'); // Nouveau conteneur

      const dateDiv = document.createElement('div');
      dateDiv.classList.add('experience-date');
      const startDate = experience.startDate ? experience.startDate.replace(/-0?$/, '') : '';
      const endDate = experience.endDate ? experience.endDate.replace(/-0?$/, '') : 'Présent';
      dateDiv.textContent = startDate + (endDate ? ` - ${endDate}` : '');

      const durationDiv = document.createElement('div');
      durationDiv.classList.add('experience-duration');
      durationDiv.textContent = experience.duration || '';

      dateDurationDiv.appendChild(dateDiv);
      dateDurationDiv.appendChild(durationDiv);

      experienceHeader.appendChild(headerLeft);
      experienceHeader.appendChild(dateDurationDiv); // Ajout du nouveau conteneur

      const descriptionDiv = document.createElement('div');
      descriptionDiv.classList.add('experience-description');
      const descriptionParagraph = document.createElement('p');
      descriptionParagraph.textContent = experience.description || '';

      if (experience.skills && experience.skills.length > 0) {
        const competencesParagraph = document.createElement('p');
        competencesParagraph.classList.add('experience-competences'); // Renommage de la classe
        competencesParagraph.textContent = 'Compétences : ' + experience.skills.join(', '); // Renommage du texte
        descriptionDiv.appendChild(competencesParagraph);
      }

      descriptionDiv.appendChild(descriptionParagraph);

      experienceItem.appendChild(experienceHeader);
      experienceItem.appendChild(descriptionDiv);

      experienceContainer.appendChild(experienceItem);
    });
  };
export const fetchExperience = async () => {
  try {
    const experienceResponse = await fetch("data/experience.json");
    const experienceData = await experienceResponse.json();
    populateExperience(experienceData);
  } catch (error) {
    console.error(
      "Erreur lors du chargement du fichier experience.json:",
      error
    );
  }
};