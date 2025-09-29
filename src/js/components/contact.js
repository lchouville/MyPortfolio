import { loadData } from "../functions/data.js";
import { loadTemplate } from "../functions/templates.js";
let lockSend = false

export async function initContact() {

  const dataSite = await loadData("src/asset/data/site.json");
  const dataPerso = await loadData("src/asset/data/personal-info.json");

  const contact = document.createElement("section");
  contact.id = "contact"
  contact.className = "mainPanel contact"

  let contatTmpl = await loadTemplate("./src/template/contact.tmpl");
  // Replace Place-holder
  contatTmpl = contatTmpl
    .replace(/{{contactTitle}}/g, dataSite.contact.title)
    .replace(/{{contactText}}/g, dataSite.contact.text)
    .replace(/{{contactName}}/g, dataSite.contact.name)
    .replace(/{{contactEmail}}/g, dataSite.contact.email)
    .replace(/{{contactMessage}}/g, dataSite.contact.message)
    .replace(/{{contactSubmit}}/g, dataSite.contact.submit)
    .replace(/{{linkedin}}/g, dataPerso.linkedin)
    .replace(/{{github}}/g, dataPerso.github)
  contact.innerHTML = contatTmpl;
  // Append on App
  document.getElementById("app").appendChild(contact);
  initEvent(dataSite.contact.emailJS);
};
function initEvent(emailJSkey) {
  const contactForm = document.getElementById("contact-form");
  const formMessage = document.getElementById("form-message");

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!lockSend) {
      lockSend = true
      emailjs.sendForm(emailJSkey.serviceId, emailJSkey.templateId, this).then(
        function () {
          console.log("SUCCESS!");
          formMessage.textContent = "Message envoyé avec succès !";
          formMessage.className = "success";
          contactForm.reset();
          lockSend = false
        },
        function (error) {
          console.log("FAILED...", error);
          formMessage.textContent = "Erreur lors de l'envoi du message.";
          formMessage.className = "error";
          lockSend = false
        }
      );
    }
  });

  const publicKey = document.createElement("script")
  publicKey.type = "text/javascript";
  publicKey.innerHTML =
    `(function () {
        emailjs.init("{{publicKey}}");
    })();`.replace(/{{publicKey}}/g, emailJSkey.publicKey)
  // Append at body end
  document.body.appendChild(publicKey)
}
