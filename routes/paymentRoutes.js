const express = require("express");
const crypto = require("crypto"); // Correct placement for crypto import
require("dotenv").config(); // To load environment variables from .env file
const Razorpay = require("razorpay");
const router = express.Router();

// Load Razorpay keys from environment variables
const razorpayKey = process.env.RAZORPAY_KEY_ID;
const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

// Ensure the keys are loaded correctly
if (!razorpayKey || !razorpaySecret) {
  console.error("Razorpay API keys are not set in the environment variables.");
  process.exit(1);
}
// console.log("Razorpay Key Loaded:", razorpayKey);

// Payment route for creating orders
router.post("/payments/orders", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    // Create a Razorpay instance
    const instance = new Razorpay({
      key_id: razorpayKey, // Razorpay Key ID
      key_secret: razorpaySecret, // Razorpay Secret Key
    });

    // Define options for the Razorpay order
    const options = {
      amount: Number(amount) * 100, // Convert amount to paise (Razorpay requires the amount in paise)
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"), // Random receipt ID
    };

    console.log("Creating order with amount:", amount);

    // Create an order with Razorpay
    const order = await instance.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: "Failed to create order" });
    }

    // Send the created order to the client
    res.status(201).json(order);
  } catch (error) {
    console.error("Error while creating order:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
