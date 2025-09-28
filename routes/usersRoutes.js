const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserModel = require("../models/userModel");

// Get Routes


// GET signup form (only for managers)
router.get("/registration1", (req, res) => {
  if (!req.session.user || req.session.user.role !== "manager") {
    return res.status(403).send("Access denied. Only the manager can register users.");
  }
  res.render("registration", { currentUser});
});

// POST registration form (manager only)
router.post("/registration1", async (req, res) => {
  const currentUser = req.session.user;
    if (!currentUser || currentUser.role !== "manager") {
      return res
        .status(403)
        .send("Access denied: Only managers can register users.");
    }

    try {
      const {
        name,
        email,
        password,
        role,
        phone,
        country,
        city,
        village,
        nin,
        gender,
      } = req.body;

      // Check if user already exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).send("User already exists.");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
        phone,
        address: { country, city, village },
        nin,
        gender,
        status: "active",
      });

      await newUser.save();
      res.redirect("/users"); // Redirect to user table page
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  

  // GET users table (manager only)
  router.get("/users", async (req, res) => {
    const currentUser = req.session.user;
    if (!currentUser || currentUser.role !== "manager") {
      return res.status(403).send("Access denied.");
    }

    try {
      const users = await UserModel.find();
      res.render("usersTable", { users, currentUser });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  });
  // this route helps to post data in the terminal
  try {
    const registration = new UserModel(req.body);
    //Save the file path to the database
    console.log(req.body);
    await registration.save();
    res.redirect("/userssection");
  } catch (error) {
    console.error(error);
    res.redirect("/registration1");
  }
});

//getting users from the database

router.get("/userssection", async (req, res) => {
  try {
    let items = await UserModel.find().sort({ $natural: -1 });
    res.render("userstable", { items }); //pass as object
  } catch (error) {
    console.error("Error fetching items", error.message);
    res.status(400).send("Unable to find data in the database.");
  }
});

//updating users
router.get("/edituser/:id", async (req, res) => {
  let item = await UserModel.findById(req.params.id);
  // console.log(item)
  res.render(`editusers`, { item });
});

router.post("/edituser/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid user ID");
  }

  try {
    const updated = await UserModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.redirect("/userssection");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//deleting users
router.post("/deleteuser/:id", async (req, res) => {
  try {
    await UserModel.deleteOne({ _id: req.params.id });
    res.redirect("/userssection");
  } catch (error) {
    res.status(400).send("Unable to delete user from database");
  }
});

module.exports = router;
