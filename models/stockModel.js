const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
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
    required: true,
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

module.exports = mongoose.model("stockModel", stockSchema);
