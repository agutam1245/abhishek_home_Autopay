const payButton = document.querySelector("#pay-button");
const feedback = document.querySelector("#payment-feedback");

fetch("/api/payment-intent")
  .then(async (response) => {
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Could not prepare the UPI payment.");
    }
    return result;
  })
  .then((result) => {
    payButton.href = result.upi_uri;
    payButton.removeAttribute("aria-disabled");
    payButton.removeAttribute("tabindex");
  })
  .catch((error) => {
    feedback.textContent = error.message;
  });
