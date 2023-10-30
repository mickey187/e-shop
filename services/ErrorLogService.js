const ErrorLog = require("../models/ErrorLog");
const winstonLogger = require("../utils/Logger");

const logError = async (error, isFatal = false, userAgent, clientIp, url) => {
  try {
    const errorLog = new ErrorLog({
      timestamp: new Date(),
      level: isFatal ? "fatal" : "error",
      message: error.message || error,
      stack: error.stack,
      ...(userAgent ? { userAgent } : {}),
      ...(clientIp ? { clientIp } : {}),
      ...(url ? { url } : {}),

      isFatal,
    });

    await errorLog.save();
  } catch (error) {
    winstonLogger.error(`An error occurred: ${error.message}`);
   
  }
};

module.exports = { logError };
