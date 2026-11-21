const feedback = document.querySelector("#feedback");
const phoneForm = document.querySelector("#phone-form");
const codeForm = document.querySelector("#code-form");
const phoneInput = document.querySelector("#phone-number");
const codeInput = document.querySelector("#verification-code");
const changeNumberButton = document.querySelector("#change-number");
const logoutButton = document.querySelector("#logout");
const loginContent = document.querySelector("#login-content");
const signedInContent = document.querySelector("#signed-in-content");
const signedInNumber = document.querySelector("#signed-in-number");

let pendingPhoneNumber = "";

function showFeedback(message, isSuccess = false) {
  feedback.textContent = message;
  feedback.classList.toggle("success", isSuccess);
}

function setSignedIn(phoneNumber) {
  loginContent.classList.add("hidden");
  signedInContent.classList.remove("hidden");
  signedInNumber.textContent = phoneNumber;
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "The request could not be completed.");
  }
  return result;
}

async function checkSession() {
  const response = await fetch("/api/session");
  if (!response.ok) {
    throw new Error("Could not check the sign-in status.");
  }
  return response.json();
}

function normalizePhoneNumber(phoneNumber) {
  return phoneNumber.replace(/[\s()-]/g, "");
}

phoneForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const phoneNumber = normalizePhoneNumber(phoneInput.value.trim());
  if (!/^\+[1-9]\d{7,14}$/.test(phoneNumber)) {
    showFeedback("Enter a valid phone number in international format, such as +15551234567.");
    return;
  }

  const sendButton = phoneForm.querySelector("button[type='submit']");
  sendButton.disabled = true;
  showFeedback("");
  try {
    const result = await postJson("/api/send-code", { phone_number: phoneNumber });
    pendingPhoneNumber = phoneNumber;
    phoneForm.classList.add("hidden");
    codeForm.classList.remove("hidden");
    codeInput.focus();
    showFeedback(result.message, true);
  } catch (error) {
    showFeedback(error.message);
  } finally {
    sendButton.disabled = false;
  }
});

codeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const code = codeInput.value.trim();
  if (!/^\d{4,10}$/.test(code)) {
    showFeedback("Enter the verification code from your SMS.");
    return;
  }

  const verifyButton = codeForm.querySelector("button[type='submit']");
  verifyButton.disabled = true;
  showFeedback("");
  try {
    const result = await postJson("/api/verify-code", {
      phone_number: pendingPhoneNumber,
      code,
    });
    setSignedIn(result.phone_number);
    showFeedback("Your number is verified and your account is ready.", true);
  } catch (error) {
    showFeedback(error.message);
  } finally {
    verifyButton.disabled = false;
  }
});

changeNumberButton.addEventListener("click", () => {
  pendingPhoneNumber = "";
  codeInput.value = "";
  codeForm.classList.add("hidden");
  phoneForm.classList.remove("hidden");
  showFeedback("");
  phoneInput.focus();
});

logoutButton.addEventListener("click", async () => {
  logoutButton.disabled = true;
  try {
    await postJson("/api/logout", {});
    signedInContent.classList.add("hidden");
    loginContent.classList.remove("hidden");
    codeForm.classList.add("hidden");
    phoneForm.classList.remove("hidden");
    pendingPhoneNumber = "";
    codeInput.value = "";
    phoneInput.value = "";
    showFeedback("You have signed out.", true);
  } catch (error) {
    showFeedback(error.message);
  } finally {
    logoutButton.disabled = false;
  }
});

checkSession()
  .then((result) => {
    if (!result.configured) {
      phoneForm.querySelector("button[type='submit']").disabled = true;
      showFeedback("Configure Twilio credentials and FLASK_SECRET_KEY in the server environment to enable SMS sign-in.");
      return;
    }
    if (result.authenticated) {
      setSignedIn(result.phone_number);
    }
  })
  .catch((error) => showFeedback(error.message));
