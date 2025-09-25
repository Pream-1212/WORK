const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserModel = require("../models/userModel");
const StockModel = require("../models/stockModel");
//getting the signup form

router.get("/registration", (req, res) => {
  res.render("registration", { title: "sign up page" });
});

router.post("/registration", async (req, res) => {
  try {
    // const user = new UserModel(req.body);
    // after saving, go to login page
    // console.log(req.body);
    let existingUser = await UserModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send("This email has already been used before!");
    }

    // create new user
    const newUser = new UserModel({
      // username: req.body.email, // required by passport-local-mongoose
      email: req.body.email,
      role: req.body.role,
      name: req.body.name,
      country: req.body.country,
      city: req.body.city,
      village: req.body.village,
      nin: req.body.nin,
      gender: req.body.gender,
      tel: req.body.tel,
    });


    const user = new UserModel(req.body);
    UserModel.register(newUser, req.body.password, (error, user) => {
      if (error) {
        return res.status(400).send("Please just try again!");
      }
      res.redirect("/login");
    });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).send("Server error. Please try again later!");
  }
});
//added this.res.redirect that directs me to the login page after registering

router.get("/login", (req, res) => {
  res.render("login", { title: "login page" });
});

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.user = req.user;
    if (req.user.role === "manager") {
      res.redirect("/manager");
    } else if (req.user.role === "attendant") {
      res.redirect("/Addsale");
    } else res.redirect("nonuser");
  }
);

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((error) => {
      if (error) {
        return res.status(500).send("Error loggingout");
      }
      res.redirect("/");
    });
  }
});



module.exports = router;
