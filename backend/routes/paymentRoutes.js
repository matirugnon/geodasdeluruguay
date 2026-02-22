const express = require('express');
const router = express.Router();

const { createPreference, createTransferOrder, webhook, verifyPayment } = require('../controllers/paymentController');

router.post('/create-preference', createPreference);
router.post('/create-transfer-order', createTransferOrder);
router.post('/webhook', webhook);
router.get('/verify-payment', verifyPayment);

module.exports = router;
