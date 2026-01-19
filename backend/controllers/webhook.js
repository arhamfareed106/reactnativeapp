const paymentService = require('../services/paymentService');
const ErrorResponse = require('../utils/errorResponse');

// @desc      Handle Stripe webhook
// @route     POST /api/v1/webhooks/stripe
// @access    Public (called by Stripe)
exports.handleStripeWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  const payload = req.rawBody; // Raw body needed for webhook signature verification

  try {
    const result = await paymentService.handleWebhook(sig, payload);
    res.status(200).send(result);
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};