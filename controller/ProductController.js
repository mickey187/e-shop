
const mongoose = require('mongoose');
var UserData = require('../models/User.js');
var Product = require('../models/Product');
var ProductAttribute = require('../models/ProductAttribute');
var ProductCategory = require('../models/ProductCategory');

// mongoose.connect('mongodb://localhost:27017/Ecommerce');

// cloud database
mongoose.connect('mongodb+srv://mickeyhailu:Bdu1011080@cluster0.w3tho.mongodb.net/Ecommerce',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});


var path = require('path');
// var multer = require('multer');
var fs = require('fs');
// var storage = multer.diskStorage({
//   destination: (err, files, cb)=>{
//       console.log("----------------------");
//       console.log(files);
//     cb(null, 'storage/');
//   },
//   filename: (req, files, cb)=>{
//     cb(null, req.body.product_description +'--'+ files.originalname)
//   }
// });
// const upload = multer({storage: storage}).any('product_image_upload');

exports.salesManagerDashboard = (req, res)=>{

  res.render('sales_manager/sales_manager_dashboard', {layout: 'main'});
}

exports.salesManagerLogout = (req, res)=>{
  console.log("testtttttttttttt"+'  ');
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
}

exports.addProductCategory = (req, res) =>{
    
    console.log(req.body);
    // const {productCategory, productSubCategory} = req.body;

  var pc = new ProductCategory({
    category: req.body.productCategory.toString(),
    subCategory: req.body.productSubCategory.toString()
  });

  pc.save((err, doc)=>{
    if(!err){
        
        res.send("success");
    }
    else{
        res.send(err);
        console.log(err);
    }
  });


}

exports.viewProductCategory = async(req, res) =>{
  var result = await ProductCategory.find();
    res.send(result);
    console.log(ProductCategory.find({}));
    //  ProductCategory.findById('62b3189c782e0985aa045d35', function(err, docs){
    //   if(!err){
    //     res.send(docs);
    //   }
    // });

    // console.log(query.select('category'));
    // console.log(query);
}

exports.addProductAttribute = (req, res) =>{
console.log(req.body);
  var pa = new ProductAttribute({
    attributeName: req.body.productAttibuteName,
    value: req.body.productAttributeValue
  });
console.log(pa);
  pa.save((err, doc)=>{

    if(!err){
        
      res.send("success");
  }
  else{
      res.send(err);
      console.log(err);
  }

  });
}

exports.viewProductAttribute = async(req, res)=>{
  var productAttributeList = await ProductAttribute.find({});
  res.send(productAttributeList);
}

exports.fetchProductCategory = async(req, res)=>{

  var productCategory = await ProductCategory.find({});
  res.send(productCategory);
}

exports.fetchProductAttribute = async(req, res)=>{
  var productAttribute = await ProductAttribute.find({});
  // console.log(productAttribute);
  res.send(productAttribute);
  
}

exports.addProduct = (req, res) =>{
// console.log(req.files);
// console.log(req.body);
var product_attribute_list_array =  req.body.product_attribute_list.split(',');
// var pp = tt.map(s => mongoose.Types.ObjectId(s));
console.log(product_attribute_list_array);
var tagsInputArray = [];
var arr = JSON.parse(req.body.tags_input);


arr.forEach(element => {
  tagsInputArray.push(element.value);
  // console.log(element.value);
  
// console.log(tagsInputArray);
});
  var product = new Product({
    name: req.body.product_name,
    price: req.body.product_price,
    quantity: req.body.product_quantity,
    category: req.body.product_category_list,
    attributes: product_attribute_list_array,
    tags: tagsInputArray,
    description: req.body.product_description

  });

  product.save( (err, doc)=>{
    let productImagePathArray = [];
    if (!err) {

      // console.log(req.files[0]);
      
      req.files.forEach(element => {
        
        fs.writeFile("storage/" + doc._id + '-' + element.originalname, element.buffer, (err) => {
          if (err){
            console.log(err);
          }
          else {
            console.log("File written successfully\n");
            productImagePathArray.push("storage/" + doc._id + '-' + element.originalname);
            console.log(productImagePathArray);
            
            Product.findByIdAndUpdate(doc._id,{images: productImagePathArray},function (err, docs) {
              if (err){
                  console.log(err)
              }
              else{
                  console.log("Updated Product : ", docs, productImagePathArray);
              }
          });
    
          }
        });

      });
      console.log(productImagePathArray);
       
      res.send("success");

    }
    else{
      console.log(err);
    }
  });

    
}

exports.viewProduct = async(req, res)=>{

  var products = await Product.find({}).populate('category').populate('attributes');
  res.send(products);
}

exports.seedProduct = (req, res) =>{
    
    // var productCategory = new ProductCategory({

    //     category: 'Home and Kitchen',
    //     subCategory: 'Furniture'
        
    // });

    // productCategory.save((err, doc)=>{
    //     if(!err){
    //         res.send(doc);
    //         console.log("success");
    //     }
    //     else{
    //         res.send("failed");
    //     }
    // });

}