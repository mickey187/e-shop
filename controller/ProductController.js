
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
var fs = require('fs');
const {validationResult} = require('express-validator');


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
console.log('req.filessssssss: ',req.files);
  var errors = validationResult(req);
  console.log(errors);

    if (!errors.isEmpty()) {

      res.status(422).json({
         message: "Validation error in your request",
         errors: errors.array()});
 } else {
  ProductCategory.exists({category: req.body.productCategory, subCategory: req.body.productSubCategory},
    (err, doc)=>{
      var storageLocation = null;
      if (doc == null) {
        var pc = new ProductCategory({
          category: req.body.productCategory.toString(),
          subCategory: req.body.productSubCategory.toString()
        });
      
        pc.save((err, doc)=>{
          if(!err){
              req.files.forEach(element => {
                fs.writeFile("storage/" + doc._id + '-' + element.originalname, element.buffer, (err) => {
                  if (err){
                    console.log(err);
                  }
                  else {
                    console.log("File written successfully\n");
                    
                  
                    storageLocation = "storage/" + doc._id + '-' + element.originalname;
                    ProductCategory.findByIdAndUpdate(doc._id,{image: storageLocation},function (err, docs) {
                      if (err){
                          console.log(err)
                      }
                      else{
                          console.log("Updated ProductCategory : ", docs);
                      }
                  });
            
                  }
                });
              });
              res.json({
                message:"success"
              });
          }
          else{
              res.status(500).json({
                message: "failed"
              });
              console.log(err);
          }
        });
      } else {
        res.json({
          message: "The specified product category and sub category already exists"
        });
      }
    });
 
 }
 


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

var errors = validationResult(req);
console.log(req.body);
  if (!errors.isEmpty()) {

  res.status(422).json({
     message: "Validation error in your request",
     errors: errors.array()});
  } else {
    ProductAttribute.exists({attributeName: req.body.productAttibuteName, value: req.body.productAttributeValue},
      (err, doc)=>{
        if (doc == null) {
           var pa = new ProductAttribute({
            attributeName: req.body.productAttibuteName,
            value: req.body.productAttributeValue
          });
        
          pa.save((err, doc)=>{
        
            if(!err){
                
              res.json({
                message:"success"
              });
          }
          else{
              res.status(500).json({
                message: "erorr"
              });
              
          }
        
          });
        } else {
         res.json({
          message: "The specified product category and sub category already exists"
         });
        }
      })
  }
  
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