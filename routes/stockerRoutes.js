// const express = require("express");
// const router = express.Router();
// const mongoose = require("mongoose");

// const Stocker = require("../models/stocker");
// // const StockModel = require("../models/stockmodel");

// router.get("/stockreport", async (req, res) => {
//   try {
//     const stockreport = await Stocker.find();
//     res.render("stocktab", { stocktab: stockreport }); 
//   } catch (error) {
//     console.error(error.message);
//     res.render("stocktab", { stocktab: [] }); // fallback so pug doesn't break
//   }
// });


// router.get("/stockrepo", async (req, res) => {
//   try {
//     let items = await Stocker.find().sort({ $natural: -1 });
//     res.render("stocktab", { items }); //pass as object
//   } catch (error) {
//     console.error("Error fetching items", error.message);
//     res.status(400).send("Unable to find data in the database.");
//   }
// });

// //updating stock
// router.get("/editstockhistory/:id", async (req, res) => {
//   if (!req.session.user || req.session.user.role !== "manager") {
//     return res.status(403).send("Forbidden: Only manager can edit stockhistory");
//   }

//   let item = await Stocker.findById(req.params.id);
//   // console.log(item)
//   res.render(`editstockhistory`, { item });
// });

// router.post("/editstockhistory/:id", async (req, res) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).send("Invalid stockhistory ID");
//   }

//   try {
//     const updated = await Stocker.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });
//     res.redirect("/stockrepo");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });


// router.post("/deletestockhistory", async (req, res) => {
//   if (!req.session.user || req.session.user.role !== 'manager') {
//     return res.status(403).send('Forbidden: Only manager can delete stockhistory');
//   }
//   try {
//     await Stocker.deleteOne({ _id: req.body.id });
//     res.redirect("stockrepo");
//   } catch (error) {
//     res.status(400).send("Unable to delete item from the database.");
//   }
// });

// module.exports = router;
