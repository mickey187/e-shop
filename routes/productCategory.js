const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  create,
  getAllProductCategory,
  getProductCategoryById,
  updateProductCategory,
  deleteProductCategory
} = require("../controller/ProductCategoryController");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.single("file"), create);

router.get("/", getAllProductCategory);
router.get("/:productCategoryId", getProductCategoryById);
router.put("/", updateProductCategory);
router.delete("/:productCategoryId", deleteProductCategory);

module.exports = router;
