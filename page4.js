const form = document.getElementById("registerForm");
const successMessage = document.getElementById("successMessage");

const STORAGE_KEY = "registrationFormDraft";

// Fields we persist (excludes password fields for basic security/privacy)
const persistedFieldIds = ["firstName", "lastName", "email", "phone", "dob"];

// Restore saved draft on page load
function restoreFormData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  try {
    const data = JSON.parse(saved);
    persistedFieldIds.forEach(id => {
      if (data[id] !== undefined) {
        document.getElementById(id).value = data[id];
      }
    });
  } catch (err) {
    console.error("Could not restore saved form data:", err);
  }
}

// Save current values to localStorage
function saveFormData() {
  const data = {};
  persistedFieldIds.forEach(id => {
    data[id] = document.getElementById(id).value;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Clear saved draft (after successful submit)
function clearSavedFormData() {
  localStorage.removeItem(STORAGE_KEY);
}

restoreFormData();

persistedFieldIds.forEach(id => {
  document.getElementById(id).addEventListener("input", saveFormData);
});

const nameRegex = /^[A-Za-z]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const phoneRegex = /^\d{10,15}$/;

function calculateAge(dobString) {
  const dob = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

// Shows an error message + red border, or clears it + adds a green border
function setFieldStatus(id, errorMessage) {
  const input = document.getElementById(id);
  const errorEl = document.getElementById(id + "Error");

  input.classList.remove("valid", "invalid");

  if (errorMessage) {
    input.classList.add("invalid");
    errorEl.textContent = errorMessage;
    return false;
  } else {
    input.classList.add("valid");
    errorEl.textContent = "";
    return true;
  }
}

// Validates a single field by id, returns true/false and updates styling
function validateField(id) {
  const value = document.getElementById(id).value.trim();

  switch (id) {
    case "firstName":
      if (!value) return setFieldStatus(id, "First name is required.");
      if (value.length < 2) return setFieldStatus(id, "First name must be at least 2 characters.");
      if (!nameRegex.test(value)) return setFieldStatus(id, "First name must contain letters only.");
      return setFieldStatus(id, "");

    case "lastName":
      if (!value) return setFieldStatus(id, "Last name is required.");
      if (value.length < 2) return setFieldStatus(id, "Last name must be at least 2 characters.");
      if (!nameRegex.test(value)) return setFieldStatus(id, "Last name must contain letters only.");
      return setFieldStatus(id, "");

    case "email":
      if (!value) return setFieldStatus(id, "Email is required.");
      if (!emailRegex.test(value)) return setFieldStatus(id, "Please enter a valid email address.");
      return setFieldStatus(id, "");

    case "password": {
      const pwd = document.getElementById("password").value;
      if (!pwd) return setFieldStatus(id, "Password is required.");
      if (!passwordRegex.test(pwd)) {
        return setFieldStatus(id, "Password must be at least 8 characters and include uppercase, lowercase, and a number.");
      }
      // Re-check confirm password whenever password changes
      if (document.getElementById("confirmPassword").value) {
        validateField("confirmPassword");
      }
      return setFieldStatus(id, "");
    }

    case "confirmPassword": {
      const pwd = document.getElementById("password").value;
      const confirmPwd = document.getElementById("confirmPassword").value;
      if (!confirmPwd) return setFieldStatus(id, "Please confirm your password.");
      if (confirmPwd !== pwd) return setFieldStatus(id, "Passwords do not match.");
      return setFieldStatus(id, "");
    }

    case "phone":
      if (!value) return setFieldStatus(id, "Phone number is required.");
      if (!phoneRegex.test(value)) return setFieldStatus(id, "Enter a valid phone number (10-15 digits, no symbols).");
      return setFieldStatus(id, "");

    case "dob":
      if (!value) return setFieldStatus(id, "Date of birth is required.");
      if (calculateAge(value) < 18) return setFieldStatus(id, "You must be at least 18 years old.");
      return setFieldStatus(id, "");

    case "terms": {
      const checked = document.getElementById("terms").checked;
      const errorEl = document.getElementById("termsError");
      if (!checked) {
        errorEl.textContent = "You must agree to the Terms & Conditions.";
        return false;
      }
      errorEl.textContent = "";
      return true;
    }
  }
}

// Attach real-time validation: check as user types AND when they leave the field
const fieldIds = ["firstName", "lastName", "email", "password", "confirmPassword", "phone", "dob", "terms"];

fieldIds.forEach(id => {
  const input = document.getElementById(id);
  const eventType = id === "terms" ? "change" : "input";
  input.addEventListener(eventType, () => validateField(id));
  input.addEventListener("blur", () => validateField(id));
});

// Final validation on submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  successMessage.style.display = "none";

  let isValid = true;
  fieldIds.forEach(id => {
    const fieldValid = validateField(id);
    if (!fieldValid) isValid = false;
  });

  if (isValid) {
    successMessage.style.display = "block";
    form.reset();
    clearSavedFormData();
    document.querySelectorAll("input").forEach(input => {
      input.classList.remove("valid", "invalid");
    });
  }
});