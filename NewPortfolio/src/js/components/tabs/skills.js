import { loadData } from "../../functions/data.js";

// Helper function to normalize skills data (works with both old and new structure)
function normalizeSkillsData(skillsData) {
  if (!skillsData) return { hardSkills: {}, softSkills: {} };

  const normalized = { hardSkills: {}, softSkills: {} };

  // Process hardSkills
  if (skillsData.hardSkills) {
    for (const [category, items] of Object.entries(skillsData.hardSkills)) {
      // Check if it's the new structure with 'items' array and metadata
      if (items.items) {
        normalized.hardSkills[category] = {
          title: items.title || category,
          description: items.description || "",
          items: items.items
        };
      } else if (Array.isArray(items)) {
        // Old structure - keep as is with default metadata
        normalized.hardSkills[category] = {
          title: category,
          description: "",
          items: items
        };
      }
    }
  }

  // Process softSkills
  if (skillsData.softSkills) {
    for (const [category, items] of Object.entries(skillsData.softSkills)) {
      // Check if it's the new structure with 'items' array and metadata
      if (items.items) {
        normalized.softSkills[category] = {
          title: items.title || category,
          description: items.description || "",
          items: items.items
        };
      } else if (Array.isArray(items)) {
        // Old structure - keep as is with default metadata
        normalized.softSkills[category] = {
          title: category,
          description: "",
          items: items
        };
      }
    }
  }

  return normalized;
}

// Populate the skills section
const populateSkills = (skillsData) => {
    const skillsTab = document.getElementById("skills-tab");
    if (!skillsTab) {
        console.error("❌ The element #skills-tab was not found.");
        return;
    }

    // Reset container
    skillsTab.innerHTML = "";

    // Normalize skills data to work with both old and new structure
    const normalizedSkills = normalizeSkillsData(skillsData);

    // Function to render a main section (Hard Skills / Soft Skills)
    const renderSection = (title, sectionTitle, sectionDescription, categories, itemClass) => {
        const sectionBlock = document.createElement("div");
        sectionBlock.classList.add("skills-section");

        // Section title
        const sectionTitleElement = document.createElement("h2");
        sectionTitleElement.textContent = sectionTitle;
        sectionTitleElement.classList.add("skills-section-title");
        sectionBlock.appendChild(sectionTitleElement);

        // Section description if available
        if (sectionDescription) {
            const sectionDescriptionElement = document.createElement("p");
            sectionDescriptionElement.textContent = sectionDescription;
            sectionDescriptionElement.classList.add("skills-section-description");
            sectionBlock.appendChild(sectionDescriptionElement);
        }

        // Loop through subcategories (Languages, Frameworks, etc.)
        Object.entries(categories).forEach(([categoryName, categoryData]) => {
            const categoryBlock = document.createElement("div");
            categoryBlock.classList.add("skill-block");

            // Header
            const header = document.createElement("div");
            header.classList.add("skill-block-header");

            const headerTitle = document.createElement("span");
            headerTitle.textContent = categoryData.title || categoryName;

            const chevron = document.createElement("i");
            chevron.classList.add("fas", "fa-chevron-down", "chevron-icon", "rotate");

            header.appendChild(headerTitle);
            header.appendChild(chevron);

            // Content
            const content = document.createElement("div");
            content.classList.add("skill-block-content", "open");

            // Category description if available
            if (categoryData.description) {
                const categoryDescription = document.createElement("p");
                categoryDescription.textContent = categoryData.description;
                categoryDescription.classList.add("skill-category-description");
                content.appendChild(categoryDescription);
            }

            const skillsGrid = document.createElement("div");
            skillsGrid.classList.add("skills-grid");

            // Add skills items
            categoryData.items.forEach((skill) => {
                const skillItem = document.createElement("div");
                skillItem.classList.add("skill-item", itemClass);

                const skillName = document.createElement("h4");
                skillName.classList.add("skill-name");
                skillName.textContent = skill.name;
                skillItem.appendChild(skillName);

                // Skill description if available
                if (skill.description) {
                    const skillDescription = document.createElement("p");
                    skillDescription.textContent = skill.description;
                    skillDescription.classList.add("skill-description");
                    skillItem.appendChild(skillDescription);
                }

                // Details list
                if (skill.details && skill.details.length > 0) {
                    const detailsList = document.createElement("ul");
                    detailsList.classList.add("skill-details");

                    skill.details.forEach((detail) => {
                        const li = document.createElement("li");
                        li.textContent = detail.name;

                        // Detail description if available
                        if (detail.description) {
                            const detailDescription = document.createElement("span");
                            detailDescription.textContent = ` - ${detail.description}`;
                            detailDescription.classList.add("detail-description");
                            li.appendChild(detailDescription);
                        }

                        detailsList.appendChild(li);
                    });

                    skillItem.appendChild(detailsList);
                }

                skillsGrid.appendChild(skillItem);
            });

            content.appendChild(skillsGrid);

            // Toggle collapse per category
            header.addEventListener("click", () => {
                const isOpen = content.classList.toggle("open");
                chevron.classList.toggle("rotate", isOpen);
            });

            categoryBlock.appendChild(header);
            categoryBlock.appendChild(content);
            sectionBlock.appendChild(categoryBlock);
        });

        skillsTab.appendChild(sectionBlock);
    };

    // Render Hard & Soft Skills with new metadata
    renderSection(
        "hardSkills",
        "Compétences Techniques",
        "Compétences techniques spécifiques liées au développement, aux outils et aux technologies.",
        normalizedSkills.hardSkills,
        "tag-hard-skill"
    );

    renderSection(
        "softSkills",
        "Compétences Transversales",
        "Compétences non-techniques comme la communication, le travail d'équipe et la gestion de projet.",
        normalizedSkills.softSkills,
        "tag-soft-skill"
    );
};

export const fetchSkills = async () => {
    try {
        const skillsData = await loadData("src/asset/data/skills.json");
        populateSkills(skillsData);
    } catch (error) {
        console.error("❌ Error while loading skills.json:", error);
    }
};
