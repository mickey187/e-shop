const userAgent = require("useragent");
const winstonLogger = require("../utils/Logger");
const ErrorLogService = require("../services/ErrorLogService");

const extractUserAgent = (req) => {
  try {
    const userAgentString = req.headers["user-agent"];
    const agent = userAgent.parse(userAgentString);
    const userAgentInfo = agent.toString();
    return userAgentInfo;
  } catch (error) {
    winstonLogger.error(`An error occurred: ${error.message}`);
    ErrorLogService.logError(error, true, null, null);
    return null;
  }
};

module.exports = { extractUserAgent };
