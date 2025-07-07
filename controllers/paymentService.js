require("dotenv").config();
const Razorpay = require("razorpay");
const crypto = require("crypto");
// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Load from environment variables
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Load from environment variables
});
// Ensure API keys are available
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("Razorpay API keys are missing in the environment variables.");
}
const createOrder = async (amount, currency) => {
  try {
    const options = {
      amount: amount * 100, // Razorpay expects the amount in the smallest unit (paise for INR)
      currency: currency,
      receipt: `receipt_${crypto.randomUUID()}`, // Unique receipt ID
    };
    console.log("Order options:", options);

    // Create the order
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    throw new Error("Error creating Razorpay order: " + error.message);
  }
};

module.exports = {
  createOrder,
};
