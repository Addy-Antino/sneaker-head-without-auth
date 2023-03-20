const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },

  state: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },
  pinCode: {
    type: Number,
    required: true,
  },
  phoneNo: {
    type: Number,
    required: true,
  },
  card_no: {
    type: Number,
  },
  product_id: {
    type: String,
    required: true,
  },



},





  {
    timestamps: true
  });

module.exports = mongoose.model("Order", orderSchema);