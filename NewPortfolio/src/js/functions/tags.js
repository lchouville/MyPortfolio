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
