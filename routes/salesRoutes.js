const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const moment = require("moment");

const addsalesModel = require("../models/addsalesModel.js");

const { ensureauthenticated, ensureagent } = require("../middleware/auth.js");
const { use } = require("passport");

const stockModel = require("../models/stockModel.js");

router.get("/Addsale", async (req, res) => {
  try {
    const stocks = await stockModel.find();
    res.render("sales", {
      stocks,
      pageClass: "sales-page", // pass pageClass to layout
    });
  } catch (error) {
    console.error(error.message);
    res.redirect("/"); // fallback if DB fails
  }
});

// ensureauthenticated,
//   ensureagent,
router.post("/Addsale", async (req, res) => {
  try {
    const {
      date,
      name,
      productName,
      productType,
      quantity,
      unitPrice,
      payment,
      transportOption,
      transportCharge,
      totalPrice,
      delivery,
      agentId, // optional: manager can select an agent
    } = req.body;

    const errors = [];

    // --- Backend validation ---
    if (!date || date.trim() === "") errors.push("");
    if (!name || name.trim() === "") errors.push("");
    if (!productName || productName.trim() === "") errors.push("");
    if (!productType || productType.trim() === "") errors.push("");
    if (!quantity || quantity.trim() === "") errors.push("");
    if (!unitPrice || unitPrice.trim() === "") errors.push("");
    if (!payment || payment.trim() === "") errors.push("");
    if (!transportOption || transportOption.trim() === "") errors.push("");
    if (!delivery || delivery.trim() === "")
      errors.push("Delivery is required");
;

    if (!req.session.user) {
      return res.status(401).send("User not logged in");
    }

    const currentUser = req.session.user;

    const stock = await stockModel.findOne({ productName, productType });
    if (!stock) {
      return res.status(400).send("Product not found in stock");
    }

    if (stock.quantity < Number(quantity)) {
      return res
        .status(400)
        .send(`Insufficient stock quantity, only ${stock.quantity} available`);
    }

    // Assign agent:
    // - If manager provided agentId, use that
    // - Otherwise use the logged-in user (agent or manager creating for self)
    const saleAgent = agentId || currentUser._id;

    // ✅ Calculate totals properly
    const baseTotal = Number(quantity) * Number(unitPrice);
    let finalTransportCharge = 0;

    // Only apply 5% if customer agreed
    if (transportOption && transportOption.toLowerCase() === "yes") {
      finalTransportCharge = 0.05 * baseTotal;
    }

    const finalTotalPrice = baseTotal + finalTransportCharge;

    const sale = new addsalesModel({
      date,
      name,
      productName,
      productType,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      payment,
      agent: saleAgent,
      transportOption,
      transportCharge: finalTransportCharge,
      totalPrice: finalTotalPrice,
      delivery,
    });

    await sale.save();

    // Deduct sold quantity from stock
    stock.quantity -= Number(quantity);
    await stock.save();

    res.redirect(`/getReceipt/${sale._id}`);
  } catch (error) {
    console.error(error.message);
    res.redirect("/Addsale");
  }
});

router.get("/salesdata", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    const currentUser = req.session.user;
    let sales;

    if (currentUser.role === "manager") {
      // Manager sees all sales
      sales = await addsalesModel.find().populate("agent", "name");
    } else {
      // Agents see only their own sales
      sales = await addsalesModel
        .find({ agent: currentUser._id })
        .populate("agent", "name");
    }

    res.render("salestable", { sales, currentUser: req.user || {}, moment });
  } catch (error) {
    console.error(error.message);
    res.redirect("/");
  }
});

//updating sales
router.get("/editsales/:id", async (req, res) => {
  let item = await addsalesModel.findById(req.params.id);
  // console.log(item)
  res.render(`editsales`, { item });
});

router.post("/editsales/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid sales ID");
  }

   try {
    const oldSale = await addsalesModel.findById(id);

    if (!oldSale) return res.status(404).send("Sale not found");

    const updatedData = {
      ...req.body,
      transportCharge: Number(req.body.transportCharge),
      totalPrice: Number(req.body.totalPrice),
    };

  const updated = await addsalesModel.findByIdAndUpdate(id, updatedData, {
    new: true,
  });

   const stockItem = await stockModel.findOne({
     productName: oldSale.productName,
   });

   if (stockItem) {
     // quantityDifference = new qty - old qty
     const quantityDifference = Number(req.body.quantity) - oldSale.quantity;
     stockItem.quantity -= quantityDifference; // decrease if +, increase if -
     await stockItem.save();
   }
       res.redirect("/salesdata");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


//deleting users
router.post("/deletesales/:id", async (req, res) => {
  try {
    await addsalesModel.deleteOne({ _id: req.params.id });
    res.redirect("/salesdata");
  } catch (error) {
    res.status(400).send("Unable to delete sales from database");
  }
});

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/getReceipt/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Requested receipt ID:", id);
  // Validate existence and format of ID
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid sale ID");
  }
  try {
    const sale = await addsalesModel
      .findById(req.params.id)
      .populate("agent", "name");
    if (!sale) {
      return res.status(404).send("Sale not found");
    }
    const currentUser = req.session.user;
    res.render("receipt", { sale, moment });
  } catch (error) {
    console.error(error.message);
    res.status(400).send("Unable to find a sale.");
  }
});

module.exports = router;
