const mongoose = require('mongoose');
const User = require('../models/User');
// mongoose.connect('mongodb://localhost:27017/Ecommerce');
// mongoose.connect('mongodb+srv://mickeyhailu:Bdu1011080@cluster0.w3tho.mongodb.net/Ecommerce',{
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => console.log("MongoDB Connected..."))
// .catch(err => console.log(err));

const {validationResult} = require('express-validator');
const { response } = require('express');
var jwt = require('jsonwebtoken');


exports.customerSignUp = async(req, res)=>{
    
    var errors = validationResult(req);
    

        if (!errors.isEmpty()) {

             res.status(422).json({
                message: "Validation error in your request",
                errors: errors.array()});
        } else {

            User.exists({email: req.body.email}, function(err, doc){
                console.log(err);
                console.log(doc);
                if (doc == null) {

                    User.register({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        username: req.body.username,
                        email: req.body.email,
                        role: req.body.role,
                        active: false},
                        req.body.password
                        );
    
                        res.status(200).json({
                            message: "User created successfully"
                        });

                } else {
                    res.status(409).json({
                        message: "User with this email already exists"
                    });
                }
            });
            
            
        }
}

exports.customerLogin = async(req, res)=>{

    var errors = validationResult(req);

    // email and password form validation
    if (!errors.isEmpty()) {
        res.status(422).json({
            message: "Validation error in your request",
            errors: errors.array()});
    } else{
        var isUser = await User.exists({email: req.body.email});

  if (isUser != null) {
    var user = await User.findById(isUser._id);
    console.log(user);
    user.authenticate(req.body.password, function (err, isPasswordValid, passwordErr) { 
        console.log(isPasswordValid);
        if (isPasswordValid) {
               jwt.sign({user: user}, 'secretkey', {expiresIn: '3600s'} ,(err, token)=>{
            res.json({
                user: user,
                token: token});
        });
        } else{
            res.status(401).json({
                message: "Incorrect email or password"
            });
        }
     });
  } else {
    res.status(401).json({
        message: "User with this email does not exist"
    });
  }
    }

  
    
}