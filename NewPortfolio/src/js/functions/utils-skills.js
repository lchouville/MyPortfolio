// src/functions/skills.js

// Generate a random pastel color (optional helper)
export function getRandomPastelColor() {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 40 + Math.floor(Math.random() * 30); // 40-70%
  const lightness = 60 + Math.floor(Math.random() * 30); // 60-90%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Normalize skills data (handles old, new, and custom formats)
export function normalizeSkillsData(skillsData) {
  if (!skillsData) return {};

  const normalized = {
    hardSkills: {},
    softSkills: {},
    flat: { hardSkills: [], softSkills: [] }, // ajout pour les expériences
  };

  // Hard skills
  if (skillsData.hardSkills) {
    for (const [category, value] of Object.entries(skillsData.hardSkills)) {
      if (category === "name" || category === "desc") continue;

      const items = value.items
        ? value.items
        : Array.isArray(value)
        ? value
        : [];

      normalized.hardSkills[category] = {
        title: value.title || category,
        description: value.description || "",
        items,
      };

      // Ajouter au flat
      normalized.flat.hardSkills.push(...items);
    }
  }

  // Soft skills
  if (skillsData.softSkills) {
    for (const [category, value] of Object.entries(skillsData.softSkills)) {
      if (category === "name" || category === "desc") continue;

      const items = value.items
        ? value.items
        : Array.isArray(value)
        ? value
        : value && value.details
        ? [
            {
              id: category,
              name: value.name,
              description: value.description,
              details: value.details,
            },
          ]
        : [];

      normalized.softSkills[category] = {
        title: value.title || category,
        description: value.description || "",
        items,
      };

      // Ajouter au flat
      normalized.flat.softSkills.push(...items);
    }
  }
  
  // Interests
  if (skillsData.interests) {
    normalized.interests = {};
    for (const [category, value] of Object.entries(skillsData.interests)) {
      if (category === "name" || category === "desc") continue;

      const items = value.items
        ? value.items
        : Array.isArray(value)
        ? value
        : [];

      normalized.interests[category] = {
        title: value.title || category,
        description: value.description || "",
        items,
      };
    }
  }
  return normalized;
}
