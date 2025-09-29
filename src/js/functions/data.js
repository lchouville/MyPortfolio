export async function loadData(jsonFile) {
  const response = await fetch(jsonFile);
  return await response.json();
}
