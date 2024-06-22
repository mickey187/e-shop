const User = require("../models/User");
const Product = require("../models/Product");
const ShoppingCart = require("../models/ShoppingCart");
const winstonLogger = require("../utils/Logger");
const {
  addToCartService,
  viewCart,
  editCartItemQuantityService,
  removeItemFromCartService,
  updateCartItemQuantityService,
  calculateCartTotalCostService,
} = require("../services/ShoppingCartService");
const ErrorLogService = require("../services/ErrorLogService");
const { extractUserAgent } = require("../utils/ExtractUserAgent");

const addToCart = async (req, res) => {
  const userAgentInfo = extractUserAgent(req) || null;
  const clientIp = req.ip || null;
  const url = req.originalUrl || null;
  try {
    const { customerId, items } = req.body;

    const shoppingCart = await addToCartService(customerId, items);
    if (shoppingCart) {
      return res.status(201).json({
        status: "success",
        statusCode: 201,
        data: shoppingCart,
      });
    }
  } catch (error) {
    console.log(`An error occurred: ${error}`);
    winstonLogger.error(`An error occurred: ${error.message}`);
    await ErrorLogService.logError(error, true, userAgentInfo, clientIp, url);
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: error.message,
    });
  }
};

const editCartItemQuantity = async (req, res) => {
  const userAgentInfo = extractUserAgent(req) || null;
  const clientIp = req.ip || null;
  const url = req.originalUrl || null;
  try {
    const { customerId, productId, newQuantity } = req.body;
    console.log("customer,prod,quant", customerId, productId, newQuantity);
    const shoppingCart = await editCartItemQuantityService(
      customerId,
      productId,
      newQuantity
    );
    
    if (shoppingCart) {
      return res.status(201).json({
        status: "success",
        statusCode: 201,
        data: shoppingCart,
      });
    }
  } catch (error) {
    console.log(`An error occurred: ${error}`);
    winstonLogger.error(`An error occurred: ${error.message}`);
    await ErrorLogService.logError(error, true, userAgentInfo, clientIp, url);
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: error.message,
    });
  }
};

const fetchShoppingCart = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const shoppingCart = await viewCart(customerId);
    return res.status(200).json({
      status: "success",
      statusCode: 200,
      data: shoppingCart,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: error.message,
    });
  }
};

const removeItemFromCart = async (req, res) => {
  try {
    const { customerId, productId } = req.body;
    
    // console.log("customerId, productId", customerId, productId);
    const shoppingCart = await removeItemFromCartService(customerId, productId);
    console.log("cart", shoppingCart);
    return res.status(201).json({
      status: "success",
      statusCode: 200,
      data: shoppingCart,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: error.message,
    });
  }
};

const updateCartItemQuantity = async (req, res) => {
  try {
  } catch (error) {}
};

module.exports = {
  addToCart,
  editCartItemQuantity,
  removeItemFromCart,
  updateCartItemQuantity,
  fetchShoppingCart,
};
