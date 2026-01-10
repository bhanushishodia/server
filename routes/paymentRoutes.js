const express = require("express");
const crypto = require("crypto"); // Correct placement for crypto import
require("dotenv").config(); // To load environment variables from .env file
const Razorpay = require("razorpay");
const router = express.Router();
const { generateInvoicePDF, generateAgreementPDF } = require("../services/pdfService");
const { sendPaymentDocsEmail } = require("../services/emailService");


// Load Razorpay keys from environment variables
const razorpayKey = process.env.RAZORPAY_KEY_ID;
const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

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
      amount: Number(amount) * 100,  // Convert amount to paise (Razorpay requires the amount in paise)
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
    res.status(201).json({
      order_id: order.id,
      amount: order.amount,
    });

  } catch (error) {
    console.error("Error while creating order:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});
// ✅ Payment verification route
router.post("/payments/verify", async (req, res) => {
  try {
    const {
      payment_id,
      order_id,
      signature,
      purchaseData,
    } = req.body;

    console.log("🔴 RECEIVED FROM FRONTEND");
    console.log("payment_id:", payment_id);
    console.log("order_id:", order_id);
    console.log("signature:", signature);

    const body = order_id + "|" + payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    console.log("🟢 EXPECTED SIGNATURE:", expectedSignature);

    if (expectedSignature !== signature) {
      console.log("❌ SIGNATURE MISMATCH");
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
        expectedSignature,
        receivedSignature: signature,
      });
    }

    console.log("✅ SIGNATURE MATCHED");


    // 🔥 Generate PDFs
const invoicePath = await generateInvoice({
  companyName: purchaseData.companyName,
  email: purchaseData.email,
  planName: purchaseData.plan.name,
  amount: purchaseData.total,
  paymentId: payment_id,
});

const agreementPath = await generateAgreement({
  companyName: purchaseData.companyName,
});


    // 📧 Send email with PDFs
    await sendPaymentDocsEmail(
      purchaseData.email,
      purchaseData.companyName || "Client",
      invoicePath,
      agreementPath
    );

    return res.json({
      success: true,
      message: "Payment verified & documents sent",
    });
  } catch (err) {
    console.error("VERIFY ERROR 👉", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


module.exports = router;
