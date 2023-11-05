const jwt = require("jsonwebtoken");
const { formatToken } = require("../services/AuthService");
const whitelist = ["/login", "/register", "/public"];

const secretKey = process.env.JWT_SECRET_KEY;

const verifyToken = (req, res, next) => {
  console.log('req.headers["authorization"]', req.headers["authorization"]);
  const token = req.headers["authorization"];

  if (!token || whitelist.includes(req.path)) {
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
