
const mongoose = require('mongoose');
var userData = require('../models/User.js');
const product_json = require('../seed/product_seed.json');
const product_category_json = require('../seed/product_category.json');
const product_attribute_json = require('../seed/product_attribute.json');
const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
const ProductAttribute = require('../models/ProductAttribute');

mongoose.connect('mongodb+srv://mickeyhailu:Bdu1011080@cluster0.w3tho.mongodb.net/Ecommerce',{
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

exports.addUser = (req, res) =>{
    // mongoose.connect('mongodb://localhost:27017/Ecommerce');
    mongoose.connect('mongodb+srv://mickeyhailu:Bdu1011080@cluster0.w3tho.mongodb.net/Ecommerce',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});
    userData.register({ 
        username: 'admin',
        email: 'admin@gmail.com',
        firstName: 'admin',
        lastName: 'admin',
        // password: 'pass',
        role: 'system_admin',
        active: false }, 'admin');


    res.send("from controller");
}
exports.seedProductCategory = async(req, res)=>{
    var done = 0;
    for (let index = 0; index < product_category_json.length; index++) {

        var pc = new ProductCategory(product_category_json[index]);
         var result = await pc.save();
         done++
         if (done === product_category_json.length) {
            mongoose.disconnect();
            res.send("success");
         }
         console.log(result);
        
    }
    

}
exports.seedProductAttribute = async(req, res)=>{

    var done = 0;
    for (let index = 0; index < product_attribute_json.length; index++) {
        var pa = new ProductAttribute(product_attribute_json[index]);
        var result = await pa.save();
        done++;
        if (done === product_attribute_json.length) {
            mongoose.disconnect();
            res.send("success");
        }
        console.log(result);
        
    }
}


exports.seedProducts = async(req, res)=>{
    var quantity = [25, 50, 75, 100, 125, 150, 175]
    var category = ["62e53beb4aed676198fca8cb", "62e53bec4aed676198fca8d7"]
    var attribute = await ProductAttribute.find().select('_id');

    var done = 0;
    var status = null;

    for (let index = 0; index < product_json.length; index++) {
        var product = new Product({
            name: product_json[index].name,
            price: product_json[index].price.split(' ')[0],
            quantity: quantity[Math.floor(Math.random() * quantity.length)],
            category: category[Math.floor(Math.random() * category.length)],
            attributes: attribute[Math.floor(Math.random() * attribute.length)],
            tags: ["shoes", "sneakers"],
            description: product_json[index].description,
            images: product_json[index].images
        
          });
          var result = await product.save();

          if (done == product_attribute_json.length) {
            mongoose.disconnect();
            res.send("success");
        }
        console.log(result);
    }
}
exports.wipeProductCollection = async(res, req)=>{
    Product.deleteMany({}, (err, result)=>{
       
        if (!err) {
            console.log("wiped");
            
        }
    });
    res.send("collection wiped");
}

