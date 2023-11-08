const ProductAttribute = require("../models/ProductAttribute");
const {
  createProductAttributeService,
  getAllProductAttributeService,
  getProductAttributeByIdService,
  updateProductAttributeService,
  deleteProductAttributeService,
} = require("../services/ProductAttributeService");
const winstonLogger = require("../utils/Logger");
const ErrorLogService = require("../services/ErrorLogService");
const { extractUserAgent } = require("../utils/ExtractUserAgent");

const createProductAttribute = async (req, res) => {
  const userAgentInfo = extractUserAgent(req) || null;
  const clientIp = req.ip || null;
  const url = req.originalUrl || null;
  try {
    const newProductCategory = await createProductAttributeService(req.body);
    if (newProductCategory) {
      return res.status(201).json({
        status: "success",
        statusCode: 201,
        data: newProductCategory,
      });
    } else {
      return res.status(500).json({
        status: "error",
        statusCode: 500,
        message: "Failed to create product attribute",
      });
    }
  } catch (error) {
    console.error(`Error creating product attribute: ${error.message}`);
    winstonLogger.error(`An error occurred: ${error.message}`);
    await ErrorLogService.logError(error, true, userAgentInfo, clientIp, url);
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: error.message,
    });
  }
};

const getAllProductAttribute = async (req, res) => {
  const userAgentInfo = extractUserAgent(req) || null;
  const clientIp = req.ip || null;
  const url = req.originalUrl || null;
  try {
    const productAttibutes = await getAllProductAttributeService();
    return res.status(201).json({
      status: "success",
      statusCode: 201,
      data: productAttibutes,
    });
  } catch (error) {
    console.error(`Error getting product attribute: ${error.message}`);
    winstonLogger.error(`An error occurred: ${error.message}`);
    await ErrorLogService.logError(error, true, userAgentInfo, clientIp, url);
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: error.message,
    });
  }
};

const getProductAttributeById = async (req, res) => {
  const userAgentInfo = extractUserAgent(req) || null;
  const clientIp = req.ip || null;
  const url = req.originalUrl || null;
  try {
    const productAttributeId = req.params.productAttributeId;
    const productAttibute = await getProductAttributeByIdService(productAttributeId);
    return res.status(201).json({
      status: "success",
      statusCode: 201,
      data: productAttibute,
    });
  } catch (error) {
    console.error(`Error getting product attribute: ${error.message}`);
    winstonLogger.error(`An error occurred: ${error.message}`);
    await ErrorLogService.logError(error, true, userAgentInfo, clientIp, url);
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: error.message,
    });
  }
};

const updateProductAttribute = async (req, res) => {
  const userAgentInfo = extractUserAgent(req) || null;
  const clientIp = req.ip || null;
  const url = req.originalUrl || null;
  try {
    const productAttibuteUpdate = req.body;
    const updatedProductAttibute = await updateProductAttributeService(
      productAttibuteUpdate
    );
    if (updatedProductAttibute) {
      return res.status(200).json({
        status: "success",
        statusCode: 201,
        data: updatedProductAttibute,
      });
    } else {
      return res.status(500).json({
        status: "error",
        statusCode: 500,
        message: "Failed to update product attribute",
      });
    }
  } catch (error) {
    console.error(`Error updating product attribute: ${error.message}`);
    winstonLogger.error(`An error occurred: ${error.message}`);
    await ErrorLogService.logError(error, true, userAgentInfo, clientIp, url);
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: error.message,
    });
  }
};

const deleteProductAttribute = async (req, res) => {
  const userAgentInfo = extractUserAgent(req) || null;
  const clientIp = req.ip || null;
  const url = req.originalUrl || null;
  try {
    const productAttributeId = req.params.productAttributeId;
    const isProdutAttributeDeleted = await deleteProductAttributeService(
      productAttributeId
    );
    if (isProdutAttributeDeleted) {
      return res.status(204).json({
        message: `product attribute with the id ${productAttributeId} was deleted`,
      });
    } else {
      throw new Error(
        `product attribute with the id ${productAttributeId} could not be deleted`
      );
    }
  } catch (error) {
    console.error(`Error deleting product attribute: ${error.message}`);
    winstonLogger.error(`An error occurred: ${error.message}`);
    await ErrorLogService.logError(error, true, userAgentInfo, clientIp, url);
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: error.message,
    });
  }
};
module.exports = {
  createProductAttribute,
  getAllProductAttribute,
  getProductAttributeById,
  updateProductAttribute,
  deleteProductAttribute,
};
