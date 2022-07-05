var express = require('express');
var router = express.Router();
const ProductController = require('../controller/ProductController');
// var path = require('path');

var multer = require('multer');
var storage = multer({dest: 'storage/'});

var storage = multer.memoryStorage(
  // {
    // destination: (err, files, cb)=>{
    //     // console.log("----------------------");
    //     // console.log(files);
    //   cb(null, 'storage/');
    // },
    // filename: (req, files, cb)=>{
    //   cb(null, req.body.product_name +'--'+ files.originalname)
    // }
  // }
  );
  const upload = multer({storage: storage});
//   upload.any('product_image_upload');


// router.get('/products', function(req, res, next){

// });
router.get('/add-product',  async function (req, res, next){
//     var ProductAttribute = require('../models/ProductAttribute');
//     var ProductCategory = require('../models/ProductCategory');
//    await ProductAttribute.deleteMany({});
//    await ProductCategory.deleteMany({});
    res.render('sales_manager/add_products',{layout: 'main'});
});

router.post('/add-product',upload.any('product_image_upload'),ProductController.addProduct);

router.get('/view-product', ProductController.viewProduct);

router.post('/add-product-category', ProductController.addProductCategory);

router.get('/view-product-category', ProductController.viewProductCategory);

router.get('/fetch-product-category', ProductController.fetchProductCategory);

router.post('/add-product-attribute', ProductController.addProductAttribute);

router.get('/view-product-attribute', ProductController.viewProductAttribute);

router.get('/fetch-product-attribute', ProductController.fetchProductAttribute);





// router.post('/add-product', ProductController.addProduct);

router.get('/seed-product', ProductController.seedProduct);

module.exports = router;
