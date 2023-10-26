const mongoose = require('mongoose');
const User = require('../models/User');
const ProductCategory = require('../models/ProductCategory');
const Product = require('../models/Product');
const ObjectId = require('mongoose').Types.ObjectId;
// mongoose.connect('mongodb://localhost:27017/Ecommerce');
// mongoose.connect('mongodb+srv://mickeyhailu:Bdu1011080@cluster0.w3tho.mongodb.net/Ecommerce',{
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => console.log("MongoDB Connected..."))
// .catch(err => console.log(err));

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

  var filter = await fetchFilter();

  const options = {
    page: req.params.page,
    limit: req.params.limit,
    populate: ['category', 'attributes'],
    collation: {
      locale: 'en',
    },
  };

  // var products = await Product.find({}).populate('category').populate('attributes');

  Product.paginate({$or: filter, $gt: new Date(Date.now() - 168*60*60 * 1000)}, options, (err, result)=>{

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

exports.fetchProductTags = async(req, res)=>{

  var productTags = await Product.find({}).select('tags').distinct('tags');
  if (productTags != null) {
    res.json({
      message: "found tags",
      tags: productTags
    });
  } else {
    res.json({
      message: "could not find tags",
      tags: null
    });
  }
}

exports.fetchProductByTags = async(req, res)=>{

  var product = await Product.find({tags: req.params.tagName});
  if (product != null) {
    res.json({
      message: "found product with the provided tag",
      product: product
    });
  } else {
    res.json({
      message: "could not find products with the provided tag name",
      product: null
    });
  }
}

async function fetchFilter(){ 

var productTags = await Product.find({}).select('tags').distinct('tags');
var filterdTagFinal = [];
  if (productTags != null) {
    var filterTags = [];
    while (true) {
      var tempTag = productTags[Math.floor(Math.random() * productTags.length)];
      if (!filterTags.includes(tempTag)) {
        filterTags.push(tempTag);
      }
      if (filterTags.length > 3) {
        break;
      }      
    }

    for (let index = 0; index < filterTags.length; index++) {
      var tempTagObj = {tags: filterTags[index]}
      filterdTagFinal.push(tempTagObj);
      
    }
    
  } else {
    console.log("filters not found");
  }
  
  console.log(filterdTagFinal);
  return filterdTagFinal;

 }

 exports.searchProducts = async(req, res)=>{
  
  var searchString = req.body.searchString.toString();
  const options = {
    page: 1,
    limit: 10,
    select: ['_id', 'name', 'tags', 'images'],
    // populate: ['category', 'attributes'],
    collation: {
      locale: 'en',
    },
  };

  Product.paginate({tags: {$regex: searchString, $options: '^i'}}, options, (err, result)=>{
    console.log(err);
    res.send(result);
    
  });

  
  // var searchResult = await Product.find({
  //                                        tags: {$regex: searchString, $options: '^i'}}).select('_id').select('name').select('tags').select('images');
  // console.log(searchResult);
  // res.json({
  //   message: "found results",
  //   searchResult: searchResult,
  //   resultFoundInNumber: searchResult.length
  // });
}

exports.fetchProductById = async(req, res)=>{
  var productId = req.params.productId;
  if (ObjectId.isValid(productId)) {
     var product = await Product.findById(productId).populate('category').populate('attributes');
  console.log(product);
  if (product != null) {
    res.json({
      message: "Found product",
      product: product 
    });
  } else {
    res.json({
      message: "product not found",
      product: null
    });
  }
  } else {
    res.json({
      message: "Invalid object id provided",
      product: product
    })
  }
 
}