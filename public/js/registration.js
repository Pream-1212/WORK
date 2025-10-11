document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const fullname = document.getElementById("fullname");
  const email = document.getElementById("exampleInputEmail1");
  const phone = document.getElementById("phone");
  const password = document.getElementById("exampleInputPassword1");
  const confirmPassword = document.getElementById("confirmPassword");
  const showPassword = document.getElementById("showPassword");
  const role = document.getElementById("role");

  // --- Show/Hide password toggle ---
  showPassword.addEventListener("change", () => {
    const type = showPassword.checked ? "text" : "password";
    password.type = type;
    confirmPassword.type = type;
  });

  // --- Helper functions for validation ---
  const validateEmail = (emailValue) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
  const validatePhone = (phoneValue) =>
    /^(?:\+256|0)\d{9}$/.test(phoneValue.trim());

  // --- Create / clear inline error messages ---
  function setError(element, message) {
    clearError(element);
    const error = document.createElement("div");
    error.className = "error-message";
    error.style.color = "red";
    error.style.fontSize = "0.85rem";
    error.textContent = message;
    element.parentNode.appendChild(error);
  }

  function clearError(element) {
    const parent = element.parentNode;
    const existingError = parent.querySelector(".error-message");
    if (existingError) parent.removeChild(existingError);
  }

  // --- Form submit validation ---
  form.addEventListener("submit", (e) => {
    let hasError = false;

    // Clear previous errors
    [fullname, email, phone, password, confirmPassword, role].forEach(
      clearError
    );

    // Full name
    if (fullname.value.trim() === "") {
      setError(fullname, "Full name is required.");
      hasError = true;
    }

    // Email
    if (!validateEmail(email.value)) {
      setError(email, "Please enter a valid email address.");
      hasError = true;
    }

    // Phone
    if (!validatePhone(phone.value)) {
      setError(
        phone,
        "Enter a valid phone number (e.g., 0771234567 or +256771234567)."
      );
      hasError = true;
    }

    // Password
    if (password.value.length < 6) {
      setError(password, "Password must be at least 6 characters.");
      hasError = true;
    }

    // Confirm password
    if (password.value !== confirmPassword.value) {
      setError(confirmPassword, "Passwords do not match.");
      hasError = true;
    }

    // Role
    if (role.value === "") {
      setError(role, "Please select a role.");
      hasError = true;
    }

    if (hasError) e.preventDefault();
  });
});
