 
    // Get elements
    const signInBtn = document.getElementById("signInBtn");
    const signUpBtn = document.getElementById("signUpBtn");

    // Handle Sign In
    signInBtn.addEventListener("click", () => {
      const email = document.getElementById("exampleInputEmail1").value;
      const password = document.getElementById("exampleInputPassword1").value;

      if (email && password) {
        alert("Signing in with:\nEmail: " + email + "\nPassword: " + password);
        window.location.href = "login.html"; // redirect to login page
      } else {
        alert("Please fill in both fields.");
      }
    });

    // Handle Sign Up
    signUpBtn.addEventListener("click", () => {
      window.location.href = "registration.html"; // redirect to registration page
    });
  