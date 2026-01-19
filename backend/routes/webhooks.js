const express = require('express');
const router = express.Router();
const { handleStripeWebhook } = require('../controllers/webhook');

// Stripe webhook route (no authentication needed as Stripe will call this)
router.post('/stripe', handleStripeWebhook);

module.exports = router;