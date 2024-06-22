const express = require("express");
const { createPaymentChannel } = require("../controller/PaymentChannelController");
const router = express.Router();

router.post("/", createPaymentChannel);

module.exports = router;