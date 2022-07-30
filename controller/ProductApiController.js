const mongoose = require('mongoose');
const User = require('../models/User');
const ProductCategory = require('../models/ProductCategory');
const Product = require('../models/Product');
// mongoose.connect('mongodb://localhost:27017/Ecommerce');
mongoose.connect('mongodb+srv://mickeyhailu:Bdu1011080@cluster0.w3tho.mongodb.net/Ecommerce',{
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected..."))
.catch(err => console.log(err));

const {validationResult} = require('express-validator');
const { response } = require('express');
var jwt = require('jsonwebtoken');

exports.fetchProductCategory = async(req, res)=>{
var productCategory = await ProductCategory.find().select('category').distinct('category');
res.json({
    categories: productCategory
});
}

exports.fetchProductSubCategory = async(req, res)=>{
  var productCategory = await ProductCategory.find({category: req.params.category});
  res.json({
    subCategory: productCategory
  });
}

exports.fetchProducts = async(req, res)=>{

  const options = {
    page: req.params.page,
    limit: req.params.limit,
    populate: ['category', 'attributes'],
    collation: {
      locale: 'en',
    },
  };

  var products = await Product.find({}).populate('category').populate('attributes');

  Product.paginate({}, options, (err, result)=>{

    res.send(result);
    
  });

  

}

exports.fetchProductsByCategory = async(req, res)=>{

  var category = req.params.category;
  var subCategory = req.params.subCategory;

  const options = {
    page: req.params.page,
    limit: req.params.limit,
    populate: ['category', 'attributes'],
    collation: {
      locale: 'en',
    },
  };

  var productCategoryId = await ProductCategory.find({category: category, subCategory: subCategory}).select('_id');
  console.log(productCategoryId);
  Product.paginate({category: productCategoryId[0]._id}, options, (err, result)=>{
    console.log(err);
    res.send(result);
    
  })

}