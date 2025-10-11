document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const emailInput = document.getElementById("exampleInputEmail1");
  const passwordInput = document.getElementById("exampleInputPassword1");

  // ✅ Email validation function
  function validateEmail(emailValue) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(emailValue).toLowerCase());
  }

  form.addEventListener("submit", (e) => {
    let errors = [];

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Check if fields are empty
    if (!email) {
      errors.push("Email is required.");
    } else if (!validateEmail(email)) {
      errors.push("Please enter a valid email address.");
    }

    if (!password) {
      errors.push("Password is required.");
    } else if (password.length < 6) {
      errors.push("Password must be at least 6 characters long.");
    }

    // If there are errors, prevent form submission
    if (errors.length > 0) {
      e.preventDefault();
      alert(errors.join("\n"));
    }
  });

  // Optional: Handle Sign Up button (redirect)
  const signUpBtn = document.getElementById("signUpBtn");
  signUpBtn.addEventListener("click", (e) => {
    e.preventDefault(); // prevent default anchor behavior
    if (
      document.querySelector("form") &&
      window.location.pathname !== "/registration"
    ) {
      window.location.href = "/registration";
    }
  });
});
