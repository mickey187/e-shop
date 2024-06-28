const express = require("express");
const { createProductReview, fetchProductReview } = require("../controller/ProductReviewController");
const router = express.Router();

router.get("/:productId", fetchProductReview);
router.post("/", createProductReview);

module.exports = router;