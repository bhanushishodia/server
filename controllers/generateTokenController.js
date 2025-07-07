const { generateAccessToken: generateAdobeAccessToken } = require('../services/adobeService');

const generateToken = async (req, res) => {  // Renamed the function to avoid conflict
    try {
        const token = await generateAdobeAccessToken();  // Use the renamed function
        res.status(200).json({ accessToken: token });
    } catch (error) {
        console.error('Error generating token:', error.message);
        console.error('Error stack:', error.stack); // Logs detailed stack trace
        res.status(500).json({ 
            message: 'Failed to generate access token', 
            error: error.message 
        });
    }
};

module.exports = { generateToken };  // Export the renamed function
