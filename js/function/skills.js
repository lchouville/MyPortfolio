/**
 * Fusionne une liste d'items en deux tableaux triés alphabétiquement (hard_skills, soft_skills).
 * @param {Array} items - Liste d'éléments (formations, projets, ...).
 * @param {Function} getCompetences - Fonction extrayant { hard_skills, soft_skills } d'un item.
 * @returns {Object} - Objet avec deux tableaux triés : hard_skills et soft_skills.
 */
export function toSortedSkillSets(items, getCompetences) {
  const allSkills = {
    hard_skills: new Set(),
    soft_skills: new Set()
  };

  items.forEach(item => {
    const competences = getCompetences(item);
    if (competences) {
      competences.hard_skills.forEach(skill => allSkills.hard_skills.add(skill));
      competences.soft_skills.forEach(skill => allSkills.soft_skills.add(skill));
    }
  });

  return {
    hard_skills: Array.from(allSkills.hard_skills).sort(),
    soft_skills: Array.from(allSkills.soft_skills).sort()
  };
}

export function mergeSkills(formationSkills, projectSkills) {
  return toSortedSkillSets(
    [formationSkills, projectSkills],
    (skills) => skills
  );
}
