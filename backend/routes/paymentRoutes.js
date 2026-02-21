const express = require('express');
const router = express.Router();

const { createPreference, createTransferOrder, webhook } = require('../controllers/paymentController');

router.post('/create-preference', createPreference);
router.post('/create-transfer-order', createTransferOrder);
router.post('/webhook', webhook);

module.exports = router;
