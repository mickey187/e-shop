var express = require('express');
var router = express.Router();
const ProductController = require('../controller/ProductController');
const connectEnsureLogin = require('connect-ensure-login');
const app = require('../app.js');
const validator = require('../middleware/validator.js');
var multer = require('multer');
var storage = multer({dest: 'storage/'});
var storage = multer.memoryStorage();
const upload = multer({storage: storage});


router.get('/add-product', async function (req, res, next){
//     var ProductAttribute = require('../models/ProductAttribute');
//     var ProductCategory = require('../models/ProductCategory');
//    await ProductAttribute.deleteMany({});
//    await ProductCategory.deleteMany({});
    res.render('sales_manager/add_products',{layout: 'main'});
});

// sales manager dashboard
router.get('/sales-manager-dashboard', ProductController.salesManagerDashboard);

//sales manager logout
router.post('/sales-manager/logout', ProductController.salesManagerLogout);

// add product (post)
router.post('/add-product',upload.any('product_image_upload'),ProductController.addProduct);

// view product
router.get('/view-product', ProductController.viewProduct);

// add product category (post)
router.post('/add-product-category', validator.validateProductCatagory, ProductController.addProductCategory);

// view product category
router.get('/view-product-category', ProductController.viewProductCategory);

// fetch product category
router.get('/fetch-product-category', ProductController.fetchProductCategory);

// add product attribute(post)
router.post('/add-product-attribute', validator.validateProductAtribute, ProductController.addProductAttribute);

// view product attribute
router.get('/view-product-attribute', ProductController.viewProductAttribute);

// fetch product attribute
router.get('/fetch-product-attribute', ProductController.fetchProductAttribute);





// router.post('/add-product', ProductController.addProduct);

router.get('/seed-product', ProductController.seedProduct);

function checkIfAuthenticated(req, res, next){
  if (req.isAuthenticated()) {
    console.log("hellllllllllllllllooooooooooo",req.isAuthenticated);
     return next();
  } else {
    res.redirect('/login');
  }
}

module.exports = router;
