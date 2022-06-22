
const mongoose = require('mongoose');
var userData = require('../models/User.js');

exports.addUser = (req, res) =>{
    mongoose.connect('mongodb://localhost:27017/Ecommerce');
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
    username: 'mike',
    email: 'micekyhailu2@gmail.com',
    firstName: 'mickey',
    lastName: 'hailu',
    // password: 'pass',
    active: false }, 'cane');
    // userData.register({ username: 'starbuck', active: false }, 'redeye');

    res.send("from controller");
}