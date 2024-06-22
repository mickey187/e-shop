var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const cors = require('cors');
var logger = require("morgan");
const bodyParser = require("body-parser"); // parser middleware
const {verifyToken} = require("./middleware/Auth");

require("./config/database"); //load db config
const User = require("./models/User.js");

const winstonLogger = require("./utils/Logger");
const { extractUserAgent } = require("./utils/ExtractUserAgent");
const ErrorLogService = require("./services/ErrorLogService");

const app = express();

// router import

const authRouter = require("./routes/auth");
const productCategoryRouter = require('./routes/productCategory');
const productAttibuteRouter = require('./routes/productAttribute.js');
const productRouter = require('./routes/product.js');
const shoppingCartRouter = require('./routes/cart.js');
const checkoutRouter = require('./routes/checkout.js');
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
// const productRouter = require("./routes/productRouter");
const apiRouter = require("./routes/api");
const systemAdminRouter = require("./routes/systemAdminRouter");
const salesStaffRouter = require("./routes/salesStaffRouter");

const paymentChannelRouter = require('./routes/paymentChannel.js');

const { engine } = require("express-handlebars");
app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(cors());
app.use(logger("dev"));
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));
app.use("/api/checkout/stripe/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/storage", express.static("storage"));



app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// link routers to their router
app.use("/auth", authRouter);
// app.use("/", verifyToken, indexRouter);
app.use("/api/product-category", productCategoryRouter);
app.use("/api/product-attribute", productAttibuteRouter);
app.use("/api/payment-channel", paymentChannelRouter);
app.use("/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/shopping-cart", shoppingCartRouter);
app.use("/api/checkout/", checkoutRouter);
app.use("/api", apiRouter);
app.use("/system-admin", systemAdminRouter);
app.use("/sales-staff", salesStaffRouter);



app.use(function (req, res, next) {
  next(createError(404));
});

process.on("uncaughtException", (error) => {
  winstonLogger.error(`Uncaught Exception error occurred: ${error.message}`);
  ErrorLogService.logError(error, true, null, null, null);
});

process.on("unhandledRejection", (error) => {
  winstonLogger.error(`Unhandled Rejection error occurred: ${error.message}`);
  ErrorLogService.logError(error, true, null, null, null);
});

// Error handler
app.use(async function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Set the response status based on the error status or default to 500
  res.status(err.status || 500);
  // Parse the user agent from the request

  const userAgentInfo = extractUserAgent(req);
  const clientIp = req.ip;
  const url = req.originalUrl;
  const isFatal = err.status === 500 ? true : false;

  winstonLogger.error(`An error occurred: ${err.message}`);
  await ErrorLogService.logError(err, isFatal, userAgentInfo, clientIp, url); // Fatal error
  // Return the error as JSON

  res.json({
    error: {
      message: err.message,
      stack: req.app.get("env") === "development" ? err.stack : undefined,
    },
  });
});

module.exports = app;
