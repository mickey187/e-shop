
const mongoose = require('mongoose');
var userData = require('../models/User.js');

exports.addUser = (req, res) =>{
    // mongoose.connect('mongodb://localhost:27017/Ecommerce');
    mongoose.connect('mongodb+srv://mickeyhailu:Bdu1011080@cluster0.w3tho.mongodb.net/Ecommerce',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});
    // var item = {
    //     firstName: 'mickey',
    //     lastName: 'hailu',
    //     username: 'mike',
    //     email: 'micekyhailu2@gmail.com',
    //     password: 'pass',
    //     role: 'customer'
    // };
    // var data = new userData(item);
    // data.save();
    userData.register({ 
        username: 'admin',
        email: 'admin@gmail.com',
        firstName: 'admin',
        lastName: 'admin',
        // password: 'pass',
        role: 'system_admin',
        active: false }, 'admin');

    // userData.register({ 
    // username: 'mike',
    // email: 'micekyhailu2@gmail.com',
    // firstName: 'mickey',
    // lastName: 'hailu',
    // role: 'sales_manager',
    // // password: 'pass',
    // active: false }, 'cane');

    // userData.register({ 
    //     username: 'john',
    //     email: 'johndoe@gmail.com',
    //     firstName: 'john',
    //     lastName: 'doe',
    //     // password: 'pass',
    //     role: 'customer',
    //     active: false }, 'pass');
    // userData.register({ username: 'starbuck', active: false }, 'redeye');

    res.send("from controller");
}