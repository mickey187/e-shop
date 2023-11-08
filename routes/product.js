const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProductDetail,
  deleteProduct
} = require("../controller/ProductController");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.array("files"), addProduct);
router.get("/", getAllProducts);
router.get("/:productId", getProductById);
router.put("/", updateProductDetail);
router.delete("/:productId", deleteProduct);

module.exports = router;
