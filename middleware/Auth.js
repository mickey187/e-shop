const verifyToken = (req, res, next) => {
  const secretKey = process.env.JWT_SECRET_KEY;
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send({ auth: false, message: "No token provided." });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });
    }

    req.userId = decoded.id;
    next();
  });
};
