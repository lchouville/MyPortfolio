import { loadData } from "../functions/data.js";

export async function initHead() {
    // Load data
    const dataSite = await loadData("src/asset/data/site.json");
    const dataPerso = await loadData("src/asset/data/personal-info.json");

    const title = document.getElementById("title")
    title.innerText = title.innerText
        .replace(/{{title}}/g, dataSite.banner.home+" "+dataPerso.names)
}