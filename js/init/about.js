// Select the about-me section from the DOM
const aboutMeSection = document.getElementById("about-me");

/**
 * Helper function to create a section with a title and a list of tags
 * @param {string} titleText - The section title
 * @param {Array} items - Array of items to display as tags
 * @param {string} itemClass - CSS class name for the container and tags
 * @returns {HTMLElement} - The complete section element
 */
const createSection = (titleText, items, itemClass) => {
  const section = document.createElement("div");

  const title = document.createElement("h1");
  title.textContent = titleText;
  section.appendChild(title);

  const list = document.createElement("div");
  list.classList.add(itemClass);

  // Create each tag and append it to the list
  items.forEach((item) => {
    const tag = document.createElement("span");
    // Derive the individual tag class based on the list class (remove 's')
    tag.classList.add(itemClass.slice(0, -1));
    tag.textContent = item;
    list.appendChild(tag);
  });

  section.appendChild(list);
  return section;
};

/**
 * Populate the about-me section with data
 * @param {Object} aboutMeData - JSON data containing title, about me text, skills and interests
 */
const populateAboutMe = (aboutMeData) => {
  if (!aboutMeSection) {
    console.error("The #about-me element was not found.");
    return;
  }

  // Create the main title
  const title = document.createElement("h1");
  title.textContent = aboutMeData.title;

  // Create the 'About Me' paragraph
  const aboutMeText = document.createElement("p");
  aboutMeText.textContent = aboutMeData.about_me;

  // Create the skills section (hard skills + soft skills)
  const skillsSection = document.createElement("div");
  skillsSection.classList.add("skills");

  skillsSection.appendChild(
    createSection("Compétences Techniques", aboutMeData.skills.hard_skills, "hardskills-tags")
  );
  skillsSection.appendChild(
    createSection("Compétences Relationnelles", aboutMeData.skills.soft_skills, "softskills-tags")
  );

  // Create the interests section
  const interestsSection = createSection(
    "Centres d'intérêt",
    aboutMeData.interests,
    "interests-tags"
  );

  // Append everything to the about-me section
  aboutMeSection.append(title, aboutMeText, skillsSection, interestsSection);
};

/**
 * Fetch about-me data from JSON file and populate the page
 */
export const fetchAboutMe = async () => {
  try {
    const aboutMeResponse = await fetch("data/personalInfo.json");
    const aboutMeData = await aboutMeResponse.json();
    populateAboutMe(aboutMeData);
  } catch (error) {
    console.error("Error loading about_me.json file:", error);
  }
};
