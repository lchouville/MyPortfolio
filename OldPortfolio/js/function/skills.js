export function mergeSkills(formationSkills, projectSkills) {
  const allSkills = {
    hard_skills: new Set(),
    soft_skills: new Set()
  };

  // Ajouter les compétences des projets
  formationSkills.hard_skills.forEach(skill => allSkills.hard_skills.add(skill));
  formationSkills.soft_skills.forEach(skill => allSkills.soft_skills.add(skill));

  // Ajouter les compétences des projets
  projectSkills.hard_skills.forEach(skill => allSkills.hard_skills.add(skill));
  projectSkills.soft_skills.forEach(skill => allSkills.soft_skills.add(skill));

  // Retourner des tableaux triés
  return {
    hard_skills: Array.from(allSkills.hard_skills).sort(),
    soft_skills: Array.from(allSkills.soft_skills).sort()
  };
}
