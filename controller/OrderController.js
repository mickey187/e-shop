const winstonLogger = require("../utils/Logger");
const { fetchOrdersService, fetchOrderByIdService, fetchOrderIdByStripePaymentIntentService } = require("../services/OrderService");
const ErrorLogService = require("../services/ErrorLogService");
const { extractUserAgent } = require("../utils/ExtractUserAgent");
const Payment = require("../models/Payment");


const fetchCustomerOrders = async (req, res) => {
  try {
    const  customerId  = req.params.customerId;
    const orders = await fetchOrdersService(customerId);
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      data: orders,
    });
  } catch (error) {
    console.error(`error fetching customer orders`);
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: error.message,
    });
  }
};

const fetchCustomerOrderById = async (req, res) => {
    try {
      const  orderId  = req.params.orderId;
      const order = await fetchOrderByIdService(orderId);
      return res.status(200).json({
        statusCode: 200,
        status: "success",
        data: order,
      });
    } catch (error) {
      console.error(`error fetching customer order by id`);
      return res.status(500).json({
        status: "error",
        statusCode: 500,
        message: error.message,
      });
    }
  };

  const fetchOrderIdByStripeIntent = async (req, res) => {
    try {
      const  paymentIntentId  = req.params.paymentIntentId;
      const orderId = await fetchOrderIdByStripePaymentIntentService(paymentIntentId);
      console.log("fetched", orderId);
      return res.status(200).json({
        statusCode: 200,
        status: "success",
        data: orderId,
      });
    } catch (error) {
      console.error(`error fetching customer order by id: ${error.message}`);
      return res.status(500).json({
        status: "error",
        statusCode: 500,
        message: error.message,
      });
    }
  };




module.exports = {fetchCustomerOrders, fetchCustomerOrderById, fetchOrderIdByStripeIntent};
