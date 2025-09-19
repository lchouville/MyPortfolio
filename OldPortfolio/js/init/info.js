const titleName = document.getElementById('info-name');
const titleQuoteText = document.getElementById('info-quote-text');
const titleQuoteAuthor = document.getElementById('info-quote-author');
const linkedin = document.getElementById('linkedin');
const github = document.getElementById('github');
const footerName = document.getElementById('footer-name');

const fillInfo = (infoData)=>{
    // Banner
    titleName.innerText = infoData.name
    titleQuoteText.innerText = infoData.quote.text
    titleQuoteAuthor.innerText = infoData.quote.author
    // Footer
    linkedin.setAttribute("href",infoData.linkedin);
    github.setAttribute("href",infoData.github);
    footerName.innerText = infoData.name
}

export const fetchInfo= async () => {
  try {
    const infoResponse = await fetch("data/personalInfo.json");
    const infoData = await infoResponse.json();
    fillInfo(infoData);
  } catch (error) {
    console.error(
      "Erreur lors du chargement du fichier personalInfo.json:",
      error
    );
  }
};

