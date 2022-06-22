var express = require('express');
var router = express.Router();
const ProductController = require('../controller/ProductController');


// router.get('/products', function(req, res, next){

// });
router.get('/add-product', function(req, res, next){
    res.render('sales_manager/add_products',{layout: 'main'});
});

router.post('/add-product-category', ProductController.addProductCategory);
router.post('/add-product', ProductController.addProduct);
router.get('/seed-product', ProductController.seedProduct);

module.exports = router;
