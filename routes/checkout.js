const express = require("express");
const router = express.Router();
const{createPaymentIntent, stripeWebhookListener}= require('../controller/CheckoutController');
const app = express();

router.post("/create-payment-intent", createPaymentIntent);
router.post("/stripe/webhook", stripeWebhookListener);

module.exports = router;