require("dotenv").config();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/order'); // Order model (if you are saving order in DB)

// Razorpay Instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Load from environment variables
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Load from environment variables
});

// Order Creation (Frontend se request aayegi to create order)
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;  // Amount from frontend (in paise, e.g. 10000 = 100 INR)
    console.log(amount)
    // Razorpay order creation
    const options = {
      amount: amount,  // Amount in paise
      currency: 'INR',
      receipt: `receipt_${crypto.randomUUID()}`, // Unique receipt ID
      payment_capture: 1,  // 1 for automatic payment capture
    };

    const order = await razorpayInstance.orders.create(options);

    // Sending the order details to frontend
    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Payment Verification (Backend me payment ko verify karna)
exports.verifyPayment = async (req, res) => {
  try {
    const { payment_id, order_id, signature } = req.body;

    // Verify the payment signature
    const body = order_id + "|" + payment_id;
    const expectedSignature = crypto.createHmac('sha256', 'YOUR_RAZORPAY_KEY_SECRET')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === signature) {
      // Signature matched, Payment successful
      // Here you can mark the order as 'paid' in your DB
      const order = await Order.findOne({ orderId: order_id });
      if (order) {
        order.paymentStatus = 'Paid';
        await order.save();
      
        console.log('Payment confirmation');
        res.json({ success: true, message: 'Payment Verified' });


      } else {
        res.status(400).json({ success: false, message: 'Order not found' });
      }
    } else {
      // Signature mismatched, Payment failed
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
