var express = require('express');
var router = express.Router();
const { fetchCustomerOrders, fetchCustomerOrderById, fetchOrderIdByStripeIntent } = require('../controller/OrderController');



router.get("/customer/:customerId", fetchCustomerOrders);
router.get("/order/:orderId", fetchCustomerOrderById);
router.get("/stripe/:paymentIntentId", fetchOrderIdByStripeIntent);



module.exports = router;