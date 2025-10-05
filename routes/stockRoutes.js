const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");



const StockModel = require("../models/stockModel");
const addsalesModel = require("../models/addsalesModel");


router.get("/stock", async (req, res) => {
  try {
    const stocks = await StockModel.find();
    res.render("stocks", { stocks }); //  You must pass { stocks }
  } catch (error) {
    console.error(error.message);
    res.render("stocks", { stocks: [] }); // fallback so pug doesn't break
  }
});

router.post("/stock", async (req, res) => {
  try {
    // 1. Update StockModel (live stock)
    let existingStock = await StockModel.findOne({
      productName: req.body.productName,
      productType: req.body.productType,
    });

    if (existingStock) {
      existingStock.quantity += parseInt(req.body.quantity);
      await existingStock.save();
    } else {
      const stocks = new StockModel(req.body);
      await stocks.save();
    }
    const Stocker = require("../models/stocker"); // import your history model
    const stockHistory = new Stocker(req.body);
    await stockHistory.save();

    // 3. Redirect back to stock list
    res.redirect("/stocklist");
  } catch (error) {
    console.error(error);
    res.redirect("/stock");
  }
});


 

router.get("/manager", async (req, res) => {
  try {
    // --- Total Remaining Stock ---
    let totalStock = await StockModel.aggregate([
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" }, // current stock
          totalCost: { $sum: { $multiply: ["$costPrice", "$quantity"] } },
        },
      },
    ]);

    // --- Total Sales Revenue ---
    let totalSales = await addsalesModel.aggregate([
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" }, // total sold items
          totalRevenue: { $sum: { $multiply: ["$unitPrice", "$quantity"] } },
        },
      },
    ]);

    // --- DEBUG: log aggregation results ---
    console.log("Raw totalStock:", totalStock);
    console.log("Raw totalSales:", totalSales);

    // --- Defaults if no data ---
    totalStock = totalStock[0] ?? { totalQuantity: 0, totalCost: 0 };
    totalSales = totalSales[0] ?? { totalQuantity: 0, totalRevenue: 0 };

    res.render("manager", {
      totalStock,
      totalSales,
    });
  } catch (error) {
    console.error("Aggregate Error:", error.message);
    res.status(400).send("Unable to fetch manager data.");
  }
});

router.get("/stocklist", async (req, res) => {
  try {
    let items = await StockModel.find().sort({ $natural: -1 });
    res.render("stocktable", { items }); //pass as object
  } catch (error) {
    console.error("Error fetching items", error.message);
    res.status(400).send("Unable to find data in the database.");
  }
});

//updating stock
router.get("/editstock/:id", async (req, res) => {
  if (!req.session.user || req.session.user.role !== "manager") {
    return res.status(403).send("Forbidden: Only manager can edit stock");
  }

  let item = await StockModel.findById(req.params.id);
  // console.log(item)
  res.render(`editstock`, { item });
});

router.post("/editstock/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid stock ID");
  }

  try {
    const updated = await StockModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.redirect("/stocklist");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


router.post("/deletestock", async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'manager') {
    return res.status(403).send('Forbidden: Only manager can delete stock');
  }
  try {
    await StockModel.deleteOne({ _id: req.body.id });
    res.redirect("stocklist");
  } catch (error) {
    res.status(400).send("Unable to delete item from the database.");
  }
});

module.exports = router;
