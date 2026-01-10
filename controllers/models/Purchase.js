const mongoose = require("mongoose");
const PurchaseSchema = new mongoose.Schema({
purchaseId: String,
clientEmail: String,
status: { type: String, default: "CREATED" },
createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Purchase", PurchaseSchema);