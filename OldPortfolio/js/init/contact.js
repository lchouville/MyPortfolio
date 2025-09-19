export const initContact = () => {
  const contactForm = document.getElementById("contact-form");
  const formMessage = document.getElementById("form-message");
  const serviceId = "service_jf3rq3w"; // Remplacez par votre ID de service EmailJS
  const templateId = "template_jf9dff8"; // Remplacez par votre ID de modèle EmailJS

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    emailjs.sendForm(serviceId, templateId, this).then(
      function () {
        console.log("SUCCESS!");
        formMessage.textContent = "Message envoyé avec succès !";
        formMessage.className = "success"; // Ajoute une classe de succès pour le style
        contactForm.reset(); // Efface le formulaire
      },
      function (error) {
        console.log("FAILED...", error);
        formMessage.textContent = "Erreur lors de l'envoi du message.";
        formMessage.className = "error"; // Ajoute une classe d'erreur pour le style
      }
    );
  });
};
