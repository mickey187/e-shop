const express = require("express");
const router = express.Router();
const {addToCart, fetchShoppingCart, editCartItemQuantity, removeItemFromCart, updateCartItemQuantity} = require('../controller/ShoppingCartController');

router.get("/:customerId", fetchShoppingCart);
router.post("/", addToCart);
router.put("/", editCartItemQuantity);
router.put("/remove", removeItemFromCart);


module.exports = router;