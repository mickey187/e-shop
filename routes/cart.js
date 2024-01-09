const express = require("express");
const router = express.Router();
const {addToCart, fetchShoppingCart, removeItemFromCart, updateCartItemQuantity} = require('../controller/ShoppingCartController');

router.get("/:customerId", fetchShoppingCart);
router.post("/", addToCart);


module.exports = router;