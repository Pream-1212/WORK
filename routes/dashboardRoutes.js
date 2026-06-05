const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/contact", (req, res) => {
  res.render("contact");
});
router.get("/products", (req, res) => {
  res.render("products");
});
router.get("/general", (req, res) => {
  res.render("general", { currentUser: req.user || null });
});
router.get("/dash", (req, res) => {
  res.render("dash");
});
router.get("/suppliers", (req, res) => {
  res.render("suppliers", { currentUser: req.user || null });
});

module.exports = router;
