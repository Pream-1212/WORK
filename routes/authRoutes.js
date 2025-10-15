const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserModel = require("../models/userModel");

// Middleware: Allow only the manager to access certain routes
function ensureManager(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "manager") {
    return next();
  }
  return res               
    .status(403)
    .send("Access denied. Only the manager can register users.");
}

// ==========================
//  SIGNUP / REGISTRATION
// ==========================

// GET signup form
router.get("/registration", async (req, res) => {
  const userCount = await UserModel.countDocuments();

  if (userCount === 0) {
    return res.render("registration", { title: "Initial Manager Setup" });
  }

  if (req.isAuthenticated() && req.user.role === "manager") {
    return res.render("registration", { title: "Register New User" });
  }

  res.status(403).send("Access denied. Only the manager can register users.");
});

// POST signup logic
router.post("/registration", async (req, res) => {
  try {
    const userCount = await UserModel.countDocuments();

    // Validate password length
    if (!req.body.password || req.body.password.length < 6) {
      return res
        .status(400)
        .send("Password must be at least 6 characters long.");
    }

    // Check if email already exists
    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send("This email has already been used before!");
    }

    // Assign role: first user becomes manager automatically
    const roleToAssign =
      userCount === 0 ? "manager" : req.body.role.toLowerCase();

    // Create user with all required fields
    const user = new UserModel({
      name: req.body.name,
      country: req.body.country,
      city: req.body.city,
      village: req.body.village,
      nin: req.body.nin,
      gender: req.body.gender,
      tel: req.body.tel,
      email: req.body.email,
      role: roleToAssign,
    });

    // Register user using passport-local-mongoose
    UserModel.register(user, req.body.password, (err, registeredUser) => {
      if (err) {
        console.error("Registration error:", err);
        return res.status(400).send("Registration failed, please try again.");
      }

      console.log(
        "✅ New user registered:",
        registeredUser.email,
        "as",
        roleToAssign
      );

      // Auto-login the first-time manager
      req.login(registeredUser, (err) => {
        if (err)
          return res.status(500).send("Login after registration failed.");
        res.redirect("/userssection"); // Redirect to users table
      });
    });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).send("Server error. Please try again later!");
  }
});

// ==========================
//  LOGIN LOGIC
// ==========================

router.get("/login", (req, res) => {
  res.render("login", { title: "Login Page" });
});

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.user = req.user;

    if (req.user.role.toLowerCase() === "manager") {
      res.redirect("/manager");
    } else if (req.user.role.toLowerCase() === "attendant") {
      res.redirect("/general");
    } else {
      res.redirect("/nonuser");
    }
  }
);

// ==========================
//  LOGOUT LOGIC
// ==========================

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((error) => {
      if (error) {
        return res.status(500).send("Error logging out");
      }
      res.redirect("/");
    });
  }
});

module.exports = router;
