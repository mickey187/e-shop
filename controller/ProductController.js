
const mongoose = require('mongoose');
var UserData = require('../models/User.js');
var Product = require('../models/Product');
var ProductAttribute = require('../models/ProductAttribute');
var ProductCategory = require('../models/ProductCategory');
mongoose.connect('mongodb://localhost:27017/Ecommerce');

exports.addProductCategory = (req, res) =>{
  req.productCategory;
  req.productSubCategory;
  var productCategory = new ProductCategory({
    category: req.productCategory,
    subCategory: req.productSubCategory
  });


}

exports.addProduct = (req, res) =>{

    
}

exports.seedProduct = (req, res) =>{
    
    var productCategory = new ProductCategory({

        category: 'Home and Kitchen',
        subCategory: 'Furniture'
        
    });

    productCategory.save((err, doc)=>{
        if(!err){
            res.send(doc);
            console.log("success");
        }
        else{
            res.send("failed");
        }
    });

}