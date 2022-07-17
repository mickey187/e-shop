const mongoose = require('mongoose');
const User = require('../models/User');
mongoose.connect('mongodb://localhost:27017/Ecommerce');
const {validationResult} = require('express-validator');
const { response } = require('express');
var jwt = require('jsonwebtoken');


exports.customerSignUp = (req, res)=>{
    
    var errors = validationResult(req);
  
        if (!errors.isEmpty()) {

             res.status(422).json({
                message: "Validation error in your request",
                errors: errors.array()});
        } else {

            User.exists({email: req.body.email}, function(err, doc){
                console.log(doc);
                if (err == null) {

                    User.register({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        username: req.body.username,
                        email: req.body.email,
                        role: req.body.role,
                        active: false},
                        req.body.password
                        );
    
                        res.json({
                            message: "User created successfully"
                        });

                    

                } else {
                    res.status(409).json({
                        messge: "User with this email already exists"
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
               jwt.sign({user: user}, 'secretkey', {expiresIn: '60s'} ,(err, token)=>{
            res.json({
                user: user,
                token: token});
        });
        } else{
            res.json({
                message: "Incorrect email or password"
            });
        }
     });
  } else {
    res.json({
        message: "User with this email does not exist"
    });
  }
    }

  
    
}