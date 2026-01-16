const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService'); // Import the email service
const { generateOtp } = require('../utils/otpUtils'); // Utility function for generating OTP
const otpStore = {};

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
  console.log("SEND OTP HIT");
  console.log("BODY:", req.body);
  const { name, email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: 'Email is required',
    });
  }

  try {
    const otp = generateOtp();

    // ✅ STORE OTP
    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    };

    await emailService.sendOtpEmail(email, name || "User", otp);

    res.json({ success: true, message: 'OTP sent successfully!' });
  } catch (error) {
    console.error('Error sending OTP email:', error);
    res.status(500).json({ message: 'Failed to send OTP email' });
  }
});
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  const record = otpStore[email];

  if (!record) {
    return res.status(400).json({ message: 'OTP not found' });
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ message: 'OTP expired' });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  // ✅ OTP verified
  delete otpStore[email];

  res.json({ success: true, message: 'OTP verified successfully' });
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
