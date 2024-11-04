const jwt = require("jsonwebtoken");
const { formatToken } = require("../services/AuthService");
const { pathToRegexp } = require("path-to-regexp");
const whitelist = [
  "/login",
  "/register",
  "/public",
  "/api/product-category",
  "/api/product-attribute",
  "/api/products",
  "/api/products/product-category/:id",
"/api/product-review/:productId",
"/api/search/products",
"/api/checkout/stripe/webhook"
];

const whitelistPatterns = whitelist.map((pattern) => pathToRegexp(pattern));

const secretKey = process.env.JWT_SECRET_KEY;

function getParentRoute(route) {
  const parts = route.split("/");
  parts.pop();
  return parts.join("/");
}

const verifyToken = (req, res, next) => {
  console.log('req.headers["authorization"]', req.headers["authorization"]);
  const token = req.headers["authorization"];
  const requestedRoute = req.path;

  const whitelistedRoutes = [
    "/api/product-category",
    "/api/product-attribute",
    "/api/products",
    "/api/products/product-category",
   
  ];

  console.log("req.path", req.path);
  // Check if the requested route matches any whitelisted route pattern
  // Check if the requested route matches any whitelisted route pattern
  const isWhitelisted = whitelistPatterns.some((pattern) =>
    pattern.test(requestedRoute)
  );

  if (isWhitelisted) {
    console.log("Route is whitelisted. Proceeding.");
    return next();
  }

  if (!token) {
    return res
      .status(403)
      .send({ auth: false, message: "A token is required for authentication" });
  }
  const formattedToken = formatToken(req.headers["authorization"]);
  jwt.verify(formattedToken, secretKey, (err, decoded) => {
    if (err) {
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });
    }

  
    req.userId = decoded.id;
    next();
  });
};

module.exports = { verifyToken };
