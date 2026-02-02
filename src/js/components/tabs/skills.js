import { loadData } from "../../functions/data.js";
import { normalizeSkillsData } from "../../functions/utils-skills.js";

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
  const renderSection = (
    title,
    sectionTitle,
    sectionDescription,
    categories,
    itemClass
  ) => {
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
      header.tabIndex = 0;
      header.setAttribute("role", "button");
      header.setAttribute("aria-expanded", "false");

      const headerTitle = document.createElement("span");
      headerTitle.textContent = categoryData.title || categoryName;

      const chevron = document.createElement("i");
      chevron.classList.add("fas", "fa-chevron-down", "chevron-icon");

      header.appendChild(headerTitle);
      header.appendChild(chevron);

      // Content
      const content = document.createElement("div");
      content.classList.add("skill-block-content");
      // initial collapsed state via inline style (robuste même si CSS chargé tard)
      content.style.maxHeight = "0px";
      content.style.overflow = "hidden";
      content.style.transition = "max-height 0.33s ease, opacity 0.25s ease";

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
      (categoryData.items || []).forEach((skill) => {
        const skillItem = document.createElement("div");
        skillItem.classList.add("skill-item", itemClass);

        // Header (icon + name in line)
        const skillHeader = document.createElement("div");
        skillHeader.classList.add("skill-header");

        if (skill.icon) {
          const icon = document.createElement("img");
          icon.src = skill.icon;
          icon.alt = `${skill.name} icon`;
          icon.classList.add("skill-icon");
          skillHeader.appendChild(icon);
        }

        const skillName = document.createElement("h4");
        skillName.classList.add("skill-name");
        skillName.textContent = skill.name;
        skillHeader.appendChild(skillName);

        skillItem.appendChild(skillHeader);

        // Description
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

      // Toggle function (robuste, accessible, animée)
      const toggleContent = () => {
        const isOpen = content.classList.toggle("open");
        // if opening -> set maxHeight to scrollHeight to animate; if closing -> 0
        if (isOpen) {
          // ensure browser has rendered content to get correct scrollHeight
          requestAnimationFrame(() => {
            content.style.maxHeight = content.scrollHeight + "px";
            content.style.opacity = "1";
          });
          header.setAttribute("aria-expanded", "true");
        } else {
          // collapse
          content.style.maxHeight = "0px";
          content.style.opacity = "0";
          header.setAttribute("aria-expanded", "false");
        }
        chevron.classList.toggle("rotate", isOpen);
      };

      // Click handler
      header.addEventListener("click", (e) => {
        e.preventDefault();
        toggleContent();
      });

      // Keyboard handler (Enter / Space)
      header.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleContent();
        }
      });

      // Append header + content to block
      categoryBlock.appendChild(header);
      categoryBlock.appendChild(content);
      sectionBlock.appendChild(categoryBlock);
    });

    skillsTab.appendChild(sectionBlock);
  };

  // Render Hard & Soft Skills
  renderSection(
    "hardSkills",
    skillsData.hardSkills?.name,
    skillsData.hardSkills?.desc,
    normalizedSkills.hardSkills,
    "tag-hard-skill"
  );

  renderSection(
    "softSkills",
    skillsData.softSkills?.name,
    skillsData.softSkills?.desc,
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
