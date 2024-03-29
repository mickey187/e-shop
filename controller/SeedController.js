
const mongoose = require('mongoose');
var userData = require('../models/User.js');

const product_json = require('../seed/product_seed.json');
const product_category_json = require('../seed/product_category.json');
const product_attribute_json = require('../seed/product_attribute.json');
const mens_product_json = require('../seed/mens_product_seed.json');
const accessory_json = require('../seed/accessory.json');
const misc_json = require('../seed/misc_product.json');

const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
const ProductAttribute = require('../models/ProductAttribute');
const {faker} = require('@faker-js/faker');

// mongoose.connect('mongodb+srv://mickeyhailu:Bdu1011080@cluster0.w3tho.mongodb.net/Ecommerce',{
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   });

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

exports.seedCustomer = async(req, res)=>{
    // generateUserName("jon", "snow");
    var sex = ['male', 'female'];
    for (let index = 0; index < 5000; index++) {
        var selected_sex = sex[Math.floor(Math.random()*sex.length)];
        var firstName = faker.name.firstName(selected_sex);
        var lastName = faker.name.lastName(selected_sex);
        userData.register({ 
        username: await generateUserName(firstName, lastName),
        email: await generateEmail(firstName, lastName),
        firstName: firstName,
        lastName: lastName,
        // password: 'pass',
        role: 'customer',
        active: false }, '12345678');
        console.log(index + "user created");
    }
    res.send("success");
    
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
exports.seedMenFashion = async(req, res)=>{
    var quantity = [25, 50, 75, 100, 125, 150, 175]
    var category = ["62e53beb4aed676198fca8cb", "62e53bec4aed676198fca8d7"]
    var attribute = await ProductAttribute.find().select('_id');

    var done = 0;
    var status = null;

    for (let index = 0; index < mens_product_json.length; index++) {
        var product = new Product({
            name: mens_product_json[index].name,
            price: mens_product_json[index].price,
            quantity: quantity[Math.floor(Math.random() * quantity.length)],
            category: "62e53bec4aed676198fca8d7",
            attributes: attribute[Math.floor(Math.random() * attribute.length)],
            tags: ["Men's", "Men's Fashion", "Fashion", "Men's Clothing"],
            description: "Men's trending fashion",
            images: mens_product_json[index].image_url
        
          });
          var result = await product.save();

          if (done == mens_product_json.length) {
            mongoose.disconnect();
            res.send("success");
        }
        console.log(result);
    }
}

exports.seedAccessory = async(req, res)=>{
    var quantity = [25, 50, 75, 100, 125, 150, 175]
    var category = ["62e53bec4aed676198fca8d3", "62e53bed4aed676198fca8db"]
    var attribute = await ProductAttribute.find().select('_id');

    var done = 0;
    var status = null;

    for (let index = 0; index < accessory_json.length; index++) {
        var product = new Product({
            name: accessory_json[index].name,
            price: accessory_json[index].price,
            quantity: quantity[Math.floor(Math.random() * quantity.length)],
            category: category[Math.floor(Math.random() * category.length)],
            attributes: attribute[Math.floor(Math.random() * attribute.length)],
            tags: ["Accessories"],
            description: "Trending accessories right now",
            images: accessory_json[index].image_url
        
          });
          var result = await product.save();

          if (done == mens_product_json.length) {
            mongoose.disconnect();
            res.send("success");
        }
        console.log(result);
    }
}

exports.seedMiscProducts = async(req, res)=>{

    var quantity = [25, 50, 75, 100, 125, 150, 175]
    var category = ["62e53bec4aed676198fca8d3", "62e53bed4aed676198fca8db"]
    var attribute = await ProductAttribute.find().select('_id');

    var done = 0;
    var status = null;

    for (let index = 0; index < misc_json.length; index++) {
        var category = await ProductCategory.find({subCategory: {'$regex': `${misc_json[index].category}`, '$options': 'i'}}).lean();
        var status = await Product.exists({name: misc_json[index].title});
        if (status == null) {
             var product = new Product({
            name: misc_json[index].title,
            price: misc_json[index].price,
            quantity: misc_json[index].stock,
            category: category[0]._id,
            attributes: attribute[Math.floor(Math.random() * attribute.length)],
            tags: [misc_json[index].brand],
            description: misc_json[index].description,
            images: misc_json[index].images
        
          });
          var result = await product.save();

          if (done == mens_product_json.length) {
            mongoose.disconnect();
            res.send("success");
        }
        console.log(result);
        }
       
    }
}
exports.wipeProductCollection = async(req, res)=>{
    Product.deleteMany({createdAt: {$gt:new Date(Date.now() - 24*60*60 * 1000)}}, (err, result)=>{
       
        if (!err) {
            console.log("wiped");
            
        }
    });
    res.send("collection wiped");
}
exports.wipeUserCollection = async(req, res)=>{
    await userData.deleteMany({createdAt: {$gt:new Date(Date.now() - 24*60*60 * 1000)}});
}

async function generateUserName(firstName, lastName) {

    var status = null;
    var userName = null;
    var index = 0;
    while (true) {
        index++;
        userName = faker.internet.userName(firstName, lastName);
        status = await userData.exists({username: userName});
        if (status == null) {
            break;
            console.log(userName);         
        }
        console.log("tried to find new unused username" + index + "times");
        
    }  
    
    return userName;

}

async function generateEmail(firstName, lastName){
    var status = null;
    var email = null;
    var index = 0;
    while (true) {
        index++;
        email = faker.internet.email(firstName, lastName);
        status = await userData.exists({email: email});
        if (status == null) {
            break;
            console.log(email);         
        }
        console.log("tried to find new unused email" + index + "times");
    }
    return email;
}

