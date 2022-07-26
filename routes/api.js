var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")
var User = require('../models/User');
const passportLocalMongoose  = require('passport-local-mongoose');

// Contollers import
const ApiAuthController = require('../controller/ApiAuthController');
const {check, validationResult} = require('express-validator');
const ProductApiController = require('../controller/ProductApiController');
const OrderApiController = require('../controller/OrderApiController');


// customer signup api endpoint
router.post('/customer/signup', [
    check('firstName').not().isEmpty().withMessage('First Name is required'),
    check('lastName').not().isEmpty().withMessage('Last Name is required'),
    check('username').not().isEmpty().withMessage('username is required'),
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is requried')
            .isLength({ min: 8 }).withMessage("password length can not be less than 8 characters")
            .custom((val, { req, loc, path }) => {
                if (val !== req.body.confirm_password) {
                    throw new Error("Passwords don't match");
                } else {
                    return val;
                }
            }),
], ApiAuthController.customerSignUp);

// customer login api endpoint
router.post('/customer/login', 
[
    check('email', 'Please enter your email address').isEmail(),
    check('password').not().isEmpty().withMessage('Please enter your password')
],
 ApiAuthController.customerLogin
);

router.get('/customer/profile', verifyToken, function(req, res) {
    
    jwt.verify(req.token, 'secretkey', (err, authData)=>{
        if (err) {
            res.sendStatus(403);
        }else{
           res.json({
           message: "profile",
           data: authData
    }) 
        }
    });
    
});

router.get('/products/fetch-product-category', ProductApiController.fetchProductCategory);

router.get('/products/fetch-product-subcategory/:category', ProductApiController.fetchProductSubCategory);

router.get('/products/fetch-products/:page/:limit', ProductApiController.fetchProducts);

router.get('/products/fetch-products-by-category/:category/:subCategory/:page/:limit', ProductApiController.fetchProductsByCategory);


// Orders Api endpoints

router.post('/orders/place-order', OrderApiController.placeOrder);



// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token

function verifyToken(req, res, next) {

     // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
    
}




module.exports = router;