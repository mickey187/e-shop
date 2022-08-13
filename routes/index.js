var express = require('express');
var router = express.Router();
const indexController = require("../controller/indexController");
const SeedController = require('../controller/SeedController');
const ProductController = require('../controller//ProductController');

const bodyParser = require('body-parser'); // parser middleware
const session = require('express-session');  // session middleware
const passport = require('passport');  // authentication
const connectEnsureLogin = require('connect-ensure-login'); //authorization
const User = require('../models/User.js');



/* GET home page. */
router.get('/', function(req, res, next){
    // res.render('auth/login', {layout:'layout'});
    res.render('auth/login', {layout: false});
    
} );

router.get('/seedCustomer', SeedController.seedCustomer);

router.get('/wipeUser', SeedController.wipeUserCollection);

router.get('/seedProductCategory', SeedController.seedProductCategory);

router.get('/seedProductAttribute', SeedController.seedProductAttribute);

router.get('/seedProduct', SeedController.seedProducts);

router.get('/wipeProductCollection', SeedController.wipeProductCollection);



router.get('/seed', SeedController.addUser);


module.exports = router;
