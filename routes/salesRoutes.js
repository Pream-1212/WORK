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
      pageClass: "sales-page",
      currentUser: req.user || null,
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

    if (!date || date.trim() === "") errors.push("Date is required");
    if (!name || name.trim() === "") errors.push("Customer name is required");
    if (!productName || productName.trim() === "") errors.push("Product name is required");
    if (!productType || productType.trim() === "") errors.push("Product type is required");
    if (!quantity || quantity.trim() === "" || Number(quantity) <= 0) errors.push("Valid quantity is required");
    if (!unitPrice || unitPrice.trim() === "" || Number(unitPrice) <= 0) errors.push("Valid unit price is required");
    if (!payment || payment.trim() === "") errors.push("Payment type is required");
    if (!transportOption || transportOption.trim() === "") errors.push("Transport option is required");
    if (!delivery || delivery.trim() === "") errors.push("Delivery is required");

    if (errors.length > 0) {
      return res.status(400).send(errors.join("<br>"));
    }

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
    const { startDate, endDate } = req.query;
    let filter = {};

    if (currentUser.role !== "manager") {
      filter.agent = currentUser._id;
    }

    // Apply date filtering if provided
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
        filter.date.$lte = end;
      }
    }

    let sales = await addsalesModel
      .find(filter)
      .populate("agent", "name")
      .sort({ date: -1 });

    // Calculate summary
    const totalRevenue = sales.reduce((sum, s) => sum + (s.totalPrice || 0), 0);
    const totalQuantity = sales.reduce((sum, s) => sum + (s.quantity || 0), 0);
    const totalTransport = sales.reduce((sum, s) => sum + (s.transportCharge || 0), 0);

    res.render("salestable", {
      sales,
      currentUser: req.user || {},
      moment,
      startDate: startDate || "",
      endDate: endDate || "",
      totalRevenue,
      totalQuantity,
      totalTransport,
    });
  } catch (error) {
    console.error(error.message);
    res.redirect("/");
  }
});

//updating sales
router.get("/editsales/:id", async (req, res) => {
  let item = await addsalesModel.findById(req.params.id);
  res.render(`editsales`, { item, currentUser: req.user || null, moment });
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
