const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService'); // Import the email service
const { generateOtp } = require('../utils/otpUtils'); // Utility function for generating OTP

// POST route to send client and admin email
router.post('/send-email', async (req, res) => {
  try {
    const { name, email, mobile, company } = req.body;
    console.log('Request received:', { name, email, mobile, company });
    // Call the email sending function from the email service
    await emailService.sendEmail({ name, email, mobile, company });
    // If email is sent successfully
    res.json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});

// POST route to send OTP email
router.post('/send-otp', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).send({
      message: 'Email and Name are required to send OTP.',
    });
  }

  try {
    const otp = generateOtp(); // Generate a new OTP
    
    // Call the sendOtpEmail function from emailService
    await emailService.sendOtpEmail(email, name, otp);

    // Return the OTP response (for the front-end)
    res.json({ message: 'OTP sent successfully to your email!', otp }); // Optionally, return the OTP in response for verification
  } catch (error) {
    console.error('Error sending OTP email:', error);
    res.status(500).json({ message: 'Failed to send OTP email', error: error.message });
  }
});

// POST route to send payment confirmation email
router.post('/send-payment-confirmation', async (req, res) => {
  const { clientEmail, clientName } = req.body;
  if (!clientEmail || !clientName) {
    return res.status(400).send({
      message: "Client email and name are required.",
    });
  }
  try {
    console.log('Payment confirmation request received:', { clientEmail, clientName });
    // Call the payment confirmation email function from the email service
    await emailService.sendPaymentConfirmationEmail(clientEmail, clientName);

    // If payment confirmation email is sent successfully
    res.json({ message: 'Payment confirmation email sent successfully!' });
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    res.status(500).json({ message: 'Failed to send payment confirmation email', error: error.message });
  }
});

module.exports = router;
