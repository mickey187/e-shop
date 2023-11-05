const path = require("path");
const ProductCategory = require("../models/ProductCategory");
const {
  createProductCategoryService,
  getAllProductCategoryService,
  getProductCategoryByIdService,
  updateProductCategoryService,
  deleteProductCategoryService,
} = require("../services/ProductCategoryService");
const { uploadFileService } = require("../services/StorageService");
const winstonLogger = require("../utils/Logger");
const ErrorLogService = require("../services/ErrorLogService");
const { extractUserAgent } = require("../utils/ExtractUserAgent");
const Product = require("../models/Product");

const create = async (req, res) => {
  const userAgentInfo = extractUserAgent(req) || null;
  const clientIp = req.ip || null;
  const url = req.originalUrl || null;
  try {
    console.log(req.file);
    const newProductCategory = await createProductCategoryService(req.body);
    const fileMimeTypes = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
    };
    const fileExtension = fileMimeTypes[req.file.mimetype] || ".png";
    const fileName = `${newProductCategory._id}${fileExtension}`;

    let productCategoryDestinationPath = path.join("product-category-image");
    const filePath = path.join(productCategoryDestinationPath, fileName);
    if (newProductCategory) {
      console.log("newProductCategory", newProductCategory);
      const productCategoryUploadResult = await uploadFileService(
        productCategoryDestinationPath,
        req.file,
        fileName
      );
      if (!productCategoryUploadResult.success) {
        throw new Error("Failed to store product category image.");
      }
      const productCategoryImageDestinationPath =
        productCategoryUploadResult.fileStoragePath;

      const filter = { _id: newProductCategory._id };
      const update = { image: productCategoryImageDestinationPath };
      const updatedProductCategory = await ProductCategory.findOneAndUpdate(
        filter,
        update,
        {
          new: true,
        }
      );
      console.log("Updated document:", updatedProductCategory);
      return res.status(201).json({
        status: "success",
        statusCode: 201,
        data: updatedProductCategory,
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

const getAllProductCategory = async (req, res) => {
  const userAgentInfo = extractUserAgent(req) || null;
  const clientIp = req.ip || null;
  const url = req.originalUrl || null;
  try {
    const productCategories = await getAllProductCategoryService();
    return res.status(200).json({
      status: "success",
      statusCode: 201,
      data: productCategories,
    });
  } catch (error) {
    console.error(`Error getting product categories: ${error.message}`);
    winstonLogger.error(`An error occurred: ${error.message}`);
    await ErrorLogService.logError(error, true, userAgentInfo, clientIp, url);
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: error.message,
    });
  }
};

const getProductCategoryById = async (req, res) => {
  const userAgentInfo = extractUserAgent(req) || null;
  const clientIp = req.ip || null;
  const url = req.originalUrl || null;
  try {
    const productCategoryId = req.params.productCategoryId;
    const productCategory = await getProductCategoryByIdService(
      productCategoryId
    );
    return res.status(200).json({
      status: "success",
      statusCode: 201,
      data: productCategory,
    });
  } catch (error) {
    console.error(`Error getting product category: ${error.message}`);
    winstonLogger.error(`An error occurred: ${error.message}`);
    await ErrorLogService.logError(error, true, userAgentInfo, clientIp, url);
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: error.message,
    });
  }
};

const updateProductCategory = async (req, res) => {
  const userAgentInfo = extractUserAgent(req) || null;
  const clientIp = req.ip || null;
  const url = req.originalUrl || null;
  try {
    const productCategoryUpdate = req.body;
    const updatedProductCategory = await updateProductCategoryService(
      productCategoryUpdate
    );
    return res.status(200).json({
      status: "success",
      statusCode: 201,
      data: updatedProductCategory,
    });
  } catch (error) {
    console.error(`Error updating product categories: ${error.message}`);
    winstonLogger.error(`An error occurred: ${error.message}`);
    await ErrorLogService.logError(error, true, userAgentInfo, clientIp, url);
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: error.message,
    });
  }
};

const deleteProductCategory = async (req, res) => {
  const userAgentInfo = extractUserAgent(req) || null;
  const clientIp = req.ip || null;
  const url = req.originalUrl || null;
  try {
    const productCategoryId = req.params.productCategoryId;
    const isProductCategoryDeleted = await deleteProductCategoryService(
      productCategoryId
    );
    if (isProductCategoryDeleted) {
      return res.status(204).json({
        message: `product category with the id ${productCategoryId} was deleted`,
      });
    } else {
      throw new Error(
        `product category with the id ${productCategoryId} could not be deleted`
      );
    }
  } catch (error) {
    console.error(`Error updating product categories: ${error.message}`);
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
  create,
  getAllProductCategory,
  getProductCategoryById,
  updateProductCategory,
  deleteProductCategory,
};
