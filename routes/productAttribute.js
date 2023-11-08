const express = require("express");
const router = express.Router();
const {
  createProductAttribute,
  getAllProductAttribute,
  getProductAttributeById,
  updateProductAttribute,
  deleteProductAttribute,
} = require("../controller/ProductAttributeController");

router.post("/", createProductAttribute);
router.get("/", getAllProductAttribute);
router.get("/:productAttributeId", getProductAttributeById);
router.put("/", updateProductAttribute);
router.delete("/:productAttributeId", deleteProductAttribute);

module.exports = router;
