const express = require('express');
const { sendWhatsAppMessage } = require('../services/whatsappService');
const router = express.Router();

router.post('/send-message', async (req, res) => {
  const { recipientName, recipientNumber, templateId, parameters } = req.body;
  console.log("Step 1: Received request at /send-message.");
  console.log("Request Body:", req.body);

  console.log(`Sending message to ${recipientNumber} with template ${templateId}`);
  try {
    console.log("Step 2: Calling sendWhatsAppMessage service.");
    const response = await sendWhatsAppMessage(recipientName, recipientNumber, templateId, parameters);
    
    console.log("Step 3: Response from sendWhatsAppMessage service:", response);
    res.status(200).json({ message: 'WhatsApp message sent successfully!', data: response });
  } catch (error) {
    console.error("Step 4: Error in /send-message route.");
    console.error('Error sending WhatsApp message:', error);
    res.status(500).json({ error: 'Failed to send WhatsApp message.' });
  }
});

module.exports = router;
