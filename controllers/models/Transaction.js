const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  companyName: String,
  email: String,

  planName: String,
  addons: Array,
  amount: Number,

  razorpayPaymentId: String,
  razorpayOrderId: String,

  invoicePath: String,
  agreementPath: String,

  status: { type: String, default: "PAID" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", transactionSchema);
