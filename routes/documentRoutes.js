const express = require('express');
const { sendForSignature, checkStatus } = require('../controllers/documentController');

const router = express.Router();

router.post('/send-for-signature', sendForSignature);
router.get('/check-status/:documentId', checkStatus);

module.exports = router;
