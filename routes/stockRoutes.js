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
    const stocks = new StockModel(req.body);
     
    console.log(req.body);
    await stocks.save();
    res.redirect("/stocklist");
  } catch (error) {
    console.error(error);
    res.redirect("/stock");
  }
});

 

router.get("/manager", async (req, res) => {
  try {
    //expenses for buying stock
    let totalExpensesPoles = await StockModel.aggregate([
      { $match: { productName: "poles" } },
      {
        $group: {
          _id: "$productType",
          totalQuantity: { $sum: "$quantity" },
          //costprice is for unitprice
          totalcost: {
            $sum: { $multiply: ["$costPrice", "$quantity"] },
          },
        },
      },
    ]);
    let totalExpensesBeds = await StockModel.aggregate([
      { $match: { productName: "Beds" } },
      {
        $group: {
          _id: "$productType",
          totalQuantity: { $sum: "$quantity" },
          //costprice is for unitprice
          totalcost: {
            $sum: { $multiply: ["$costPrice", "$quantity"] },
          },
        },
      },
    ]);
    let totalExpensesCabinets = await StockModel.aggregate([
      { $match: { productName: "Cabinets" } },
      {
        $group: {
          _id: "$productType",
          totalQuantity: { $sum: "$quantity" },
          //costprice is for unitprice
          totalcost: {
            $sum: { $multiply: ["$costPrice", "$quantity"] },
          },
        },
      },
    ]);
    //sales revenue
    let totalRevenueSofa = await addsalesModel.aggregate([
      { $match: { productName: "sofa" } },
      {
        $group: {
          _id: "$productType",
          totalQuantity: { $sum: "$quantity" },
          //price is for unitprice
          totalcost: {
            $sum: { $multiply: ["$price", "$quantity"] },
          },
        },
      },
    ]);
    //to avoid crashing the app if no expenses have been added
    //set default values if no expenses in the db
    totalRevenueSofa = totalRevenueSofa[0] || {
      totalQuantity: 0,
      totalcost: 0,
    };

    totalExpensesPoles = totalExpensesPoles[0] ?? {
      totalQuantity: 0,
      totalcost: 0,
    };
    totalExpensesBeds = totalExpensesBeds[0] ?? {
      totalQuantity: 0,
      totalcost: 0,
    };
    (totalExpensesCabinets = totalExpensesCabinets[0] ?? {
      totalQuantity: 0,
      totalcost: 0,
    }),
      res.render("manager", {
        totalExpensesPoles,
        totalExpensesBeds,
        totalExpensesCabinets,
        totalRevenueSofa: totalRevenueSofa,
      });
  } catch (error) {
    res.status(400).send("Unable to find data in the database.");
    console.error("Aggregate Error:", error.message);
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

// router.delete("/stocklist/:id", async (req,res) =>{
//   try {
//    await StockModel.findByIdAndDelete(req.params.id);
//     res.redirect('/stocklist')
//   } catch (error) {
//       return res.status(500).send("error deleting product.")
//      }
// });
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
