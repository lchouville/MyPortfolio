/**
 * Create a list of skill tags with optional tooltips or sub-blocks
 * @param {Array} skills - List of skills (with id + usedDetails)
 * @param {Object} skillsData - Reference JSON of all skills
 * @param {String} itemClass - CSS class applied to tags
 * @param {Boolean} asSubBlocks - If true, show details inline as subtags (default: false)
 * @returns {HTMLElement} - A container <div> with all tags
 */
export function createSkillsTags(
  skills,
  skillsData,
  itemClass,
  asSubBlocks = false
) {
  const list = document.createElement("div");
  list.classList.add("competences-tags");

  // Create one global tooltip if it doesn't already exist
  let tooltip = document.querySelector(".tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    document.body.appendChild(tooltip);
  }

  // Flatten categories into a single array of skills
  const allSkills = Object.values(skillsData).flat();

  let hideTimeout = null;

  /**
   * Position tooltip above or below the hovered tag
   */
  const positionTooltip = (tag) => {
    const tagRect = tag.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    let top = window.scrollY + tagRect.top - tooltipRect.height - 8;
    let left =
      window.scrollX + tagRect.left + tagRect.width / 2 - tooltipRect.width / 2;

    tooltip.classList.remove("above", "below");

    // If not enough space above → place below
    if (top < window.scrollY) {
      top = window.scrollY + tagRect.bottom + 8;
      tooltip.classList.add("below");
    } else {
      tooltip.classList.add("above");
    }

    // Prevent horizontal overflow
    if (left < 8) left = 8;
    if (left + tooltipRect.width > window.innerWidth - 8) {
      left = window.innerWidth - tooltipRect.width - 8;
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  };

  /**
   * Show tooltip for the hovered tag
   */
  const showTooltip = (tag, content) => {
    if (hideTimeout) clearTimeout(hideTimeout);

    tooltip.textContent = content;
    tooltip.style.opacity = "1";
    tooltip.style.visibility = "visible";

    // Wait a frame to position correctly (tooltip must be rendered first)
    requestAnimationFrame(() => positionTooltip(tag));
  };

  /**
   * Hide tooltip after a small delay
   */
  const hideTooltip = () => {
    hideTimeout = setTimeout(() => {
      tooltip.style.opacity = "0";
      tooltip.style.visibility = "hidden";
      tooltip.classList.remove("above", "below");
    }, 150);
  };
   // 🔹 Compute length = skill name + all used details names
  const getSkillLength = (skill) => {
    const skillObj = allSkills.find(s => s.id === skill.id);
    if (!skillObj) return 0;

    let totalLength = skillObj.name.length;

    if (skill.usedDetails?.length > 0 && skillObj.details && asSubBlocks) {
      const details = skillObj.details.filter(d => skill.usedDetails.includes(d.id));
      totalLength += details.reduce((sum, d) => sum + d.name.length, 0);
    }

    return totalLength;
  };

  // 🔹 Sort skills based on computed length
  const sortedSkills = [...skills].sort((a, b) => getSkillLength(a) - getSkillLength(b));

  // Build each skill tag
  sortedSkills.forEach((skill) => {
    const skillObj = allSkills.find((s) => s.id === skill.id);
    if (!skillObj) return;

    const tag = document.createElement("span");
    tag.classList.add("competence-tag", itemClass);
    tag.textContent = skillObj.name;
    list.appendChild(tag);

    // If details exist
    if (skill.usedDetails?.length && skillObj.details) {
      const details = skillObj.details.filter((d) =>
        skill.usedDetails.includes(d.id)
      );

      if (details.length > 0) {
        if (asSubBlocks) {
          // Inline subtags (expandable mode)
          details.forEach((d) => {
            const subtag = document.createElement("span");
            subtag.classList.add("competence-subtag", itemClass);
            subtag.textContent = d.name;
            tag.appendChild(subtag);
          });
        } else {
          // Tooltip mode
          const detailsText = details.map((d) => d.name).join(", ");
          tag.classList.add("has-tooltip");

          tag.addEventListener("mouseenter", () =>
            showTooltip(tag, detailsText)
          );
          tag.addEventListener("mouseleave", hideTooltip);
        }
      }
    }
  });

  return list;
}

/**
 * Create a simple tag list (without details or tooltips)
 */
export function createTagsList(items, itemClass) {
  const list = document.createElement("div");
  list.classList.add("competences-tags");

  items.forEach((competence) => {
    const tag = document.createElement("span");
    tag.classList.add("competence-tag", itemClass);
    tag.textContent = competence;
    list.appendChild(tag);
  });

  return list;
}
