const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const moment = require("moment");

const addsalesModel = require("../models/addsalesModel.js"); // adjust path
const { ensureauthenticated, ensureagent } = require("../middleware/auth.js");
const { use } = require("passport");
const stockModel = require("../models/stockModel.js");

// GET all sales and render page
// router.get("/Addsale", async (req, res) => {
//   try {
//     const sales = await salesModel.find();
//     res.render("sales", { title: "Sales Entry", sales });
//   } catch (err) {
//     console.error("Error fetching sales:", err.message);
//     res.status(500).send("Error fetching sales");
//   }
// });

router.get("/Addsale", async (req, res) => {
    try {
        const stocks = await stockModel.find();
        res.render("sales",{stocks});
    } catch (error) {
        console.error(error.message);
    }
});
    
 

// POST new sale
// router.post("/Addsale", async (req, res) => {
//   try {
//     const sale = new addsalesModel(req.body);
//     console.log(req.body);
//     const savedSale = await sale.save();

//     console.log("Saved sale:", savedSale);

//     // Fetch all sales after saving to render updated table
//     const sales = await addsalesModel.find();
//     res.render("sales", { title: "Sales Entry", sales });
//   } catch (err) {
//     console.error("Save error:", err.message);
//     res.status(400).send("Error saving sale: " + err.message);
//   }
// });
// ensureauthenticated,
//   ensureagent,
router.post("/Addsale", async (req, res) => {
  try {
    const {
      date,
      name,
      product,
      quantity,
      unitPrice,
      payment,
      delivery,
    } = req.body;
    const userId = req.session.user._id;
    const [productType, productName] = req.body.product.split(":");
const stock = await stockModel.findOne({productType,productName});
if(!stock){
    return res.status(400).send("Product not found in stock");
};
if(stock.quantity < Number(quantity)){
    return res.status(400).send(`Insufficient stock quantity, only${stock.quantity} available`);
}
//if you don't have total price, you can calculate it here.
//let total = unitPrice * quantity;

//if you have totalPrice already captured
if (stock && stock.quantity > 0 ){


let
    const sale = new addsalesModel({
      date,
      name,
      product,
      quantity,
      unitPrice,
      payment,
      agent: userId, // Use the logged-in user's ID
      delivery,
    });
    console.log(userId);
    await sale.save();

    // Deduct sold quantity from stock
    stock.quantity -= quantity;
    console.log("new quantity after sale", stock.quantity);
    await stock.save();
    res.redirect("/salesdata");
    }else{
        return res.status(404).send("Products not found or sod out.")
    }
  } catch (error) {
    console.error(error.message);
    res.redirect("/Addsale");
  }
});

router.get("/salesdata", async (req, res) => {
  try {
    //sales agent only sees their own sales
    const sales = await addsalesModel.find().populate("agent", "name");
    // console.log(sales);
    const currentUser = req.session.user;
    console.log(currentUser);
    res.render("salestable", { sales:currentUser });
  } catch (error) {
    console.error(error.message);
    res.redirect("/");
  }
});
// router.get("/salesdata", async (req, res) => {
//   try {
//     let items = await addsalesModel.find().sort({ $natural: -1 });
//     res.render("salestable", { items, moment }); //pass as object
//   } catch (error) {
//     console.error("Error fetching items", error.message);
//     res.status(400).send("Unable to find data in the database.");
//   }
// });

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
    const updated = await addsalesModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
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

module.exports = router;
