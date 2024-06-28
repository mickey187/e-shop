const winstonLogger = require("../utils/Logger");
const ErrorLogService = require("../services/ErrorLogService");
const { extractUserAgent } = require("../utils/ExtractUserAgent");

const {
  createProductReviewService,
  fetchReviewsForProductService,
} = require("../services/ProductReviewService");

const createProductReview = async (req, res) => {
  const userAgentInfo = extractUserAgent(req) || null;
  const clientIp = req.ip || null;
  const url = req.originalUrl || null;
  try {
    const { title, productId, comment, rating, customerId } = req.body;
    const newReview = await createProductReviewService(
      customerId,
      productId,
      rating,
      title,
      comment
    );

    return res.status(201).json({
      status: "success",
      statusCode: 201,
      data: newReview,
    });
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

const fetchProductReview = async (req, res) => {
    const userAgentInfo = extractUserAgent(req) || null;
    const clientIp = req.ip || null;
    const url = req.originalUrl || null;
    try {
      const  productId = req.params.productId;
      const reviews = await fetchReviewsForProductService(
        productId,
      );

      console.log("reviews: ", reviews);
  
      return res.status(201).json({
        status: "success",
        statusCode: 201,
        data: reviews,
      });
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

module.exports = { createProductReview, fetchProductReview };
