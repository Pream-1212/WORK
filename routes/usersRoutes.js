const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
const UserModel = require("../models/userModel");

// Get Routes
router.get("/userssection", async (req, res) => {
  try {
    let items = await UserModel.find().sort({ $natural: -1 });
    res.render("userstable", { items, currentUser: req.user }); //pass as object
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