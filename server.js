// const https = require("https");
// const fs = require("fs");

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require('cors');
const emailRoutes = require('./routes/emailRoutes');  // Import your email routes file
const emailService = require('./services/emailService');
const paymentRoutes = require("./routes/paymentRoutes");
const whatsappRoutes = require("./routes/whatsappRoutes"); // Import WhatsApp routes
const documentRoutes = require('./routes/documentRoutes');
// const { sendTemplateMessage } = require('./services/sendMessage');


const { sendPaymentConfirmationEmail } = require('./services/emailService');
const app = express();
require('dotenv').config();  // Ensure this is at the top of the file

// Enable CORS for all routes
app.use(cors());

// Body Parser middleware
app.use(bodyParser.json());

// Middleware to parse JSON requests
app.use(express.json());
// Payment routes
app.use("/api", paymentRoutes);
// Routes

// Register routes
app.use('/api/documents', documentRoutes);

// WhatsApp routes
app.use("/api/whatsapp", whatsappRoutes);

// Email routes - All email-related routes will now be available under '/api'
app.use('/api', emailRoutes);


app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log('Request body:', req.body);
  next();
});

// Root route to test the server
app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});

// Define the /payment/success route
app.post("/payment/success", (req, res) => {
  console.log("Payment verification endpoint hit:", req.body);

  // Dummy response for testing payment success
  res.status(200).json({ message: "Payment verification route working!" });
});
// Endpoint to handle sending the payment confirmation email
app.post('/send-payment-confirmation', async (req, res) => {
  const { clientEmail, clientName } = req.body;
  if (!clientEmail) {
    return res.status(400).json({ message: 'Client email is required' });
  }
  try {
    await sendPaymentConfirmationEmail(clientEmail, clientName);
    res.status(200).send('Email sent successfully!');
  } catch (error) {
    res.status(500).send('Failed to send email');
  }
});
// Form submission endpoint
app.post('/submit-form', (req, res) => {
  const { clientEmail, clientName } = req.body;

  // Send email to Admin and Client
  emailService.sendEmailToAdmin(clientEmail);
  emailService.sendEmailToClient(clientEmail, clientName);

  res.status(200).send('Form submitted, emails sent, and agreement sent for signature.');
});

// Serve static files from React's build folder
// app.use(express.static(path.join(__dirname, "build"))); 

// // Redirect all other requests to index.html (for React SPA)
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// Use process.env for port
const PORT = process.env.PORT || 5000;
// Start the server on port 5000
// app.listen(5000, () => { 
app.listen(PORT, () => {
  console.log("Server running on http://localhost:5000");
});

// last chnage 13 march final