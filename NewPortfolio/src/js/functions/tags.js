export function createSkillsTags(skills, skillsData, itemClass) {
  const list = document.createElement("div");
  list.classList.add("competences-tags");

  // Aplatit toutes les catégories
  const allSkills = Object.values(skillsData).flat();

  skills.forEach(skill => {
    const skillObj = allSkills.find(s => s.id === skill.id);
    if (!skillObj) return; // skip si compétence inconnue

    // Crée un tag principal pour la compétence
    const tag = document.createElement("span");
    tag.classList.add("competence-tag", itemClass);
    tag.textContent = skillObj.name;

    // Si usedDetails présents, ajoute-les dans le tag
    // if (skill.usedDetails && skill.usedDetails.length > 0) {
    //   const detailsText = skillObj.details
    //     .filter(d => skill.usedDetails.includes(d.id))
    //     .map(d => d.name)
    //     .join(", ");
    //   tag.textContent += ` (${detailsText})`;
    // }

    list.appendChild(tag);
  });

  return list;
}

export function createTagsList(items, itemClass) {
  const list = document.createElement("div");
  list.classList.add("competences-tags");
  // Create each tag and append it to the list
  items.forEach((competence) => {
    const tag = document.createElement("span");
    tag.classList.add("competence-tag", itemClass);
    tag.textContent = competence;
    list.appendChild(tag);
  });
  return list
}
