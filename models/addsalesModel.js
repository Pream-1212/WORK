const mongoose = require("mongoose");

const addsaleSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  productName: {
    type: String,
    required: true,
  },
  productType: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  payment: {
    type: String,
    required: true,
    trim: true,
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
  transportOption: { type: Boolean, default: false },
  transportCharge: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true }, // includes 5% if applicable
  delivery: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("addsalesModel", addsaleSchema);
