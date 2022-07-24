const mongoose = require('mongoose');
const User = require('../models/User');
const ProductCategory = require('../models/ProductCategory');
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