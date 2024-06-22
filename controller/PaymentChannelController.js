
const winstonLogger = require("../utils/Logger");
const {
  createPaymentChannelService,
} = require("../services/PaymentChannelService");
const ErrorLogService = require("../services/ErrorLogService");
const { extractUserAgent } = require("../utils/ExtractUserAgent");

const createPaymentChannel = async (req, res) => {
    const userAgentInfo = extractUserAgent(req) || null;
    const clientIp = req.ip || null;
    const url = req.originalUrl || null;
  try {
    const { channelName, description } = req.body;
    const paymentChannel = await createPaymentChannelService(
      channelName,
      description
    );
    return res.status(201).json({
      status: "success",
      statusCode: 201,
      data: paymentChannel,
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

module.exports = { createPaymentChannel };
