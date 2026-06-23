const navLinks = document.querySelector("#nav-links");
const menuButton = document.querySelector(".menu-button");
const quoteForm = document.querySelector("#quote-form");
const formStatus = document.querySelector("#form-status");

menuButton?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navLinks?.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }
});

quoteForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(quoteForm);
  const payload = Object.fromEntries(formData.entries());
  const action = quoteForm.getAttribute("action") || "";

  if (!action || action.includes("YOUR_FORM_ID")) {
    openEmailFallback(payload);
    formStatus.textContent = "Your email app should open with the request filled in. Replace YOUR_FORM_ID to send directly from the website.";
    return;
  }

  formStatus.textContent = "Sending request...";

  try {
    const response = await fetch(action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" }
    });

    if (!response.ok) {
      throw new Error("Form submission failed.");
    }

    quoteForm.reset();
    formStatus.textContent = "Thanks. Your request was sent.";
  } catch (error) {
    openEmailFallback(payload);
    formStatus.textContent = "The form service did not respond, so your email app opened with the request filled in.";
  }
});

function openEmailFallback(payload) {
  const subject = encodeURIComponent("New O'Brien's Power Washing quote request");
  const body = encodeURIComponent(
    [
      `Name: ${payload.name || ""}`,
      `Email: ${payload.email || ""}`,
      `Phone: ${payload.phone || ""}`,
      `City: ${payload.city || ""}`,
      `Service: ${payload.service || ""}`,
      "",
      "Project details:",
      payload.message || ""
    ].join("\n")
  );

  window.location.href = `mailto:pobrienpowerwashing@gmail.com?subject=${subject}&body=${body}`;
}
