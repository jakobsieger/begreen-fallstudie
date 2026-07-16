const form = document.querySelector("#contact-form");
const statusMessage = document.querySelector("#form-status");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  statusMessage.textContent = "Ihre Nachricht wurde erfolgreich versendet.";
  form.reset();
});