const mongoose = require("mongoose");

const stocksSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },

  productType: {
    type: String,
    required: true,
  },

  costPrice: {
    type: Number,
    required: true,
  },

  sellPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  supplierName: {
    type: String,
    required: false,
  },
  quality: {
    type: String,
  },
  color: {
    type: String,
  },
  measurements: {
    type: String,
  },
});

module.exports = mongoose.model("stocker", stocksSchema);
 