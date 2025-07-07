const axios = require('axios');

const sendForSignature = async (req, res) => {
  const { recipientName, recipientEmail } = req.body;

  const data = {
    test_mode: false, // Live mode (disable test mode)
    draft: false,
    with_signature_page: false,
    reminders: true,
    apply_signing_order: false,
    embedded_signing: true,
    embedded_signing_notifications: false,
    text_tags: false,
    allow_decline: true,
    allow_reassign: true,
    template_id: "your-template-id",  // Use your actual template ID
    name: "Anantya Agreement",
    subject: "Sign Anantya Agreement",
    recipients: [
      {
        send_email: true,
        send_email_delay: 0,
        id: "1",
        name: recipientName,
        email: recipientEmail,
        placeholder_name: "Client"
      }
    ]
  };

  try {
    const response = await axios.post(
      'https://www.signwell.com/api/v1/document_templates/documents', // External API endpoint
      data,
      {
        headers: {
          'X-Api-Key': 'your-api-key',  // Your API key
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }
    );

    res.json({
      message: 'Document sent for signature successfully!',
      documentUrl: response.data.embedded_signing_url, // URL to sign the document
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error while sending document for signature' });
  }
};

module.exports = sendForSignature;
