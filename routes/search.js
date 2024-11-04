const express = require('express');
const { searchProducts } = require('../controller/SearchController');
const router = express.Router();

router.get('/products', searchProducts);

module.exports = router;