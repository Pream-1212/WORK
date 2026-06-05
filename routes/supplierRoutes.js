const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const moment = require("moment");
const SupplierModel = require("../models/supplierModel");

router.get("/suppliers-list", async (req, res) => {
  try {
    const suppliers = await SupplierModel.find().sort({ dateAdded: -1 });
    res.render("supplierstable", { suppliers, moment, currentUser: req.user || null });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to load suppliers");
  }
});

router.get("/add-supplier", (req, res) => {
  res.render("addsupplier", { currentUser: req.user || null });
});

router.post("/add-supplier", async (req, res) => {
  try {
    const { name, contactPerson, email, phone, address, productsSupplied, commission } = req.body;
    if (!name || !name.trim()) return res.status(400).send("Supplier name is required");
    if (!phone || !phone.trim()) return res.status(400).send("Phone number is required");

    const supplier = new SupplierModel({
      name: name.trim(),
      contactPerson: contactPerson ? contactPerson.trim() : "",
      email: email ? email.trim() : "",
      phone: phone.trim(),
      address: address ? address.trim() : "",
      productsSupplied: productsSupplied ? productsSupplied.trim() : "",
      commission: Number(commission) || 0,
    });
    await supplier.save();
    res.redirect("/suppliers-list");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to add supplier");
  }
});

router.get("/edit-supplier/:id", async (req, res) => {
  try {
    const supplier = await SupplierModel.findById(req.params.id);
    if (!supplier) return res.status(404).send("Supplier not found");
    res.render("editsupplier", { supplier, currentUser: req.user || null });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching supplier");
  }
});

router.post("/edit-supplier/:id", async (req, res) => {
  try {
    const { name, contactPerson, email, phone, address, productsSupplied, commission } = req.body;
    if (!name || !name.trim()) return res.status(400).send("Supplier name is required");
    if (!phone || !phone.trim()) return res.status(400).send("Phone number is required");

    await SupplierModel.findByIdAndUpdate(req.params.id, {
      name: name.trim(),
      contactPerson: contactPerson ? contactPerson.trim() : "",
      email: email ? email.trim() : "",
      phone: phone.trim(),
      address: address ? address.trim() : "",
      productsSupplied: productsSupplied ? productsSupplied.trim() : "",
      commission: Number(commission) || 0,
    });
    res.redirect("/suppliers-list");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update supplier");
  }
});

router.post("/delete-supplier/:id", async (req, res) => {
  try {
    await SupplierModel.findByIdAndDelete(req.params.id);
    res.redirect("/suppliers-list");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to delete supplier");
  }
});

module.exports = router;
