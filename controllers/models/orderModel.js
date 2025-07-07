const mongoose = require('mongoose');
 // Define the schema for the Order
const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,  // Razorpay Order ID
    unique: true,    // Ensure each order ID is unique
  },
  amount: {
    type: Number,
    required: true,  // Amount in paise
  },
  currency: {
    type: String,
    default: 'INR',  // Default currency
  },
  paymentStatus: {
    type: String,
    default: 'Pending', // Payment status ('Pending', 'Paid', 'Failed')
  },
  createdAt: {
    type: Date,
    default: Date.now,  // Timestamp of order creation
  },
  paymentId: {
    type: String,       // Razorpay Payment ID (after payment)
  },
  signature: {
    type: String,       // Razorpay signature (after payment)
  },
});

// Create and export the Order model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
