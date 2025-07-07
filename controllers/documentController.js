const axios = require('axios');
const API_KEY = process.env.SIGNWELL_API_KEY;
const BASE_URL = 'https://www.signwell.com/api/v1';

exports.sendForSignature = async (req, res) => {
    console.log('Received request:', req.body);
    const { template_id, email } = req.body;

    if (!template_id || !email) {
        return res.status(400).json({ message: 'Template ID and email are required.' });
    }

    try {
        const payload = {
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
            template_id,
            name: 'Anantya Agreement',
            subject: 'Sign Anantya Agreement',
            recipients: [
                {
                    send_email: true,
                    send_email_delay: 0,
                    id: '1',
                    name: 'Recipient Name',
                    email,
                    placeholder_name: 'Client',
                },
            ],
        };
        console.log('Payload:', payload); // Log the payload
        const response = await axios.post(`${BASE_URL}/document_templates/documents`, payload, {
            headers: {
                'X-Api-Key': API_KEY,
                accept: 'application/json',
                'content-type': 'application/json',
            },
        });

        res.status(200).json({ id: response.data?.id });
    } catch (error) {
        const errorMessage = error.response?.data || 'Error sending document for signature.';
        console.error('Error:', errorMessage);
        res.status(500).json({ message: errorMessage });
    }
};

exports.checkStatus = async (req, res) => {
    const { documentId } = req.params;

    if (!documentId) {
        return res.status(400).json({ message: 'Document ID is required.' });
    }

    try {
        const response = await axios.get(`${BASE_URL}/documents/${documentId}/`, {
            headers: {
                'X-Api-Key': API_KEY,
                accept: 'application/json',
            },
        });

        res.status(200).json({ status: response.data?.status });
    } catch (error) {
        const errorMessage = error.response?.data || 'Error checking document status.';
        console.error('Error:', errorMessage);
        res.status(500).json({ message: errorMessage });
    }
};
