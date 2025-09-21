

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const fullname = document.getElementById("fullname");
  const email = document.getElementById("exampleInputEmail1");
  const phone = document.getElementById("phone");
  const password = document.getElementById("exampleInputPassword1");
  const confirmPassword = document.getElementById("confirmPassword");
  const showPassword = document.getElementById("showPassword");
  const role = document.getElementById("role");

  // ✅ 1. Show/Hide password toggle
  showPassword.addEventListener("change", () => {
    const type = showPassword.checked ? "text" : "password";
    password.type = type;
    confirmPassword.type = type;
  });

  // ✅ 2. Email validation function
  function validateEmail(emailValue) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(emailValue).toLowerCase());
  }

  // ✅ 3. Phone validation (Uganda style: 10 digits starting with 0, or +256...)
  function validatePhone(phoneValue) {
    const re = /^(?:\+256|0)\d{9}$/;
    return re.test(phoneValue.trim());
  }

  // ✅ 4. Form submit validation
  form.addEventListener("submit", (e) => {
    let errors = [];

    if (fullname.value.trim() === "") {
      errors.push("Full name is required.");
    }

    if (!validateEmail(email.value)) {
      errors.push("Please enter a valid email address.");
    }

    if (!validatePhone(phone.value)) {
      errors.push(
        "Please enter a valid phone number (e.g., 0771234567 or +256771234567)."
      );
    }

    if (password.value.length < 6) {
      errors.push("Password must be at least 6 characters.");
    }

    if (password.value !== confirmPassword.value) {
      errors.push("Passwords do not match.");
    }

    if (role.value === "") {
      errors.push("Please select a role.");
    }

    if (errors.length > 0) {
      e.preventDefault();
      alert(errors.join("\n"));
    }
  });
});
