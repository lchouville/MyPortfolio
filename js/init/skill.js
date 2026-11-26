const langagesContainer = document.getElementById("langages");

const populateSkills = (skillData) => {
  if (!langagesContainer) {
    console.error("L'élément #langages n'a pas été trouvé dans #skills-tab.");
    return;
  }

  const hardSkills = skillData.HardSkills || {};
  Object.values(hardSkills).forEach((skills) => {
    skills.forEach((skill) => {
      const tag = document.createElement("div");
      tag.classList.add("skill-tag");

      const icon = document.createElement("i");
      icon.className = `${skill.icone} colored`;
      tag.appendChild(icon);

      const title = document.createElement("span");
      title.textContent = skill.title;
      tag.appendChild(title);

      langagesContainer.appendChild(tag);
    });
  });
};

export const fetchSkill = async () => {
  try {
    const skillResponse = await fetch("data/skill.json");
    const skillData = await skillResponse.json();
    populateSkills(skillData);
  } catch (error) {
    console.error("Erreur lors du chargement du fichier skill.json:", error);
  }
};
