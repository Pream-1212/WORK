const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");



const StockModel = require("../models/stockModel");
const Stocker = require("../models/stocker"); // import your history model
const addsalesModel = require("../models/addsalesModel");

// Helper: Validate stock input
function validateStockData(body) {
  const errors = [];
  const requiredFields = [
    "productName",
    "productType",
    "costPrice",
    "sellPrice",
    "quantity",
    "quality",
  ];

  // --- Required checks ---
  requiredFields.forEach((field) => {
    if (!body[field] || body[field].toString().trim() === "") {
      errors.push(`${field} is required.`);
    }
  });

  // --- Number validations ---
  if (body.costPrice && (isNaN(body.costPrice) || Number(body.costPrice) <= 0))
    errors.push("Cost Price must be a valid positive number.");

  if (body.sellPrice && (isNaN(body.sellPrice) || Number(body.sellPrice) <= 0))
    errors.push("Selling Price must be a valid positive number.");

  if (
    body.quantity &&
    (!Number.isInteger(Number(body.quantity)) || Number(body.quantity) <= 0)
  )
    errors.push("Quantity must be a valid whole number greater than 0.");

  // --- Optional text fields ---
  ["supplierName", "color", "measurements"].forEach((field) => {
    if (body[field] && typeof body[field] !== "string") {
      errors.push(`${field} must be text if provided.`);
    }
  });

  return errors;
}



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
    // ✅ Validate data first
    const errors = validateStockData(req.body);
    if (errors.length > 0) {
      console.log("Validation errors:", errors);
      return res.status(400).send(errors.join("<br>"));
      // or res.render("stocks", { errorMessages: errors });
    }
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

    const stockHistory = new Stocker(req.body);
    await stockHistory.save();

    // 3. Redirect back to stock list
    res.redirect("/stocklist");
  } catch (error) {
    console.error(error);
    res.redirect("/stock");
  }
});

router.get("/stockreport", async (req, res) => {
  try {
    const stockreport = await Stocker.find().sort({ _id: -1});
    res.render("stocktab", { stocktab: stockreport }); 
  } catch (err) {
    console.error(err);
     res.status(500).send("Failed to load stock history");
  }
});

// GET route to render edit form for a specific stock record
router.get("/editstockhistory/:id", async (req, res) => {
  try {
    const stockItem = await Stocker.findById(req.params.id); // use history collection
    if (!stockItem) {
      return res.status(404).send("Stock record not found");
    }
    // Render an edit page (create editstock.pug separately)
    res.render("editstockhistory", { pageClass: "form-page", item: stockItem });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching stock record");
  }
});

// POST route to handle form submission for updating the stock record
router.post("/editstockhistory/:id", async (req, res) => {
  try {
    const {
      productName,
      productType,
      costPrice,
      sellPrice,
      quantity,
      supplierName,
      quality,
      color,
      measurements,
    } = req.body;

    const updatedStock = await Stocker.findByIdAndUpdate(
      req.params.id,
      {
        productName,
        productType,
        costPrice,
        sellPrice,
        quantity,
        supplierName,
        quality,
        color,
        measurements,
      },
      { new: true } // return the updated document
    );

    if (!updatedStock) {
      return res.status(404).send("Stock record not found");
    }

    // Redirect back to stockreport page
    res.redirect("/stockreport");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update stock record");
  }
});

// POST route to delete a specific stock record
router.post("/deletestockhistory/:id", async (req, res) => {
  try {
    await Stocker.deleteOne({ _id: req.params.id });
    // Redirect back to stockreport page after deletion
    res.redirect("/stockreport");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to delete stock record");
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
          totalRevenue: {
            $sum: {
              $add: [
                { $multiply: ["$unitPrice", "$quantity"] },
                { $ifNull: ["$transport", 0] }, // sum all transport charges
              ],
            },
          },
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
    res.render("stocktable", { items,}); //pass as object
  } catch (error) {
    console.error("Error fetching items", error.message);
    res.status(400).send("Unable to find data in the database.");
  }
});



module.exports = router;
