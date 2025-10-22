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
    required: false,
  },
  quality: {
    type: String,
  },
  color: {
    type: String,
    required: false,
  },
  measurements: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("stockModel", stockSchema);
