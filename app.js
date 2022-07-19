var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser'); // parser middleware
const session = require('express-session');  // session middleware
const passport = require('passport');  // authentication
const connectEnsureLogin = require('connect-ensure-login'); //authorization
const User = require('./models/User.js');
// const BearerStrategy = require('passport-http-bearer');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/productRouter');
var apiRouter = require('./routes/api');
// var router = express.Router({ mergeParams: true });

var app = express();
const SeedController = require('./controller/SeedController');

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');


const {engine} = require('express-handlebars');
app.engine('hbs', engine({extname: ".hbs"}));
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'storage')));
app.use('/storage', express.static('storage'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(session({
  secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// // Passport Local Strategy
passport.use(User.createStrategy());

// // To use with sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get('/login', function(req, res){
res.render('auth/login', {layout:'layout'});
});

app.get('/dashboard', connectEnsureLogin.ensureLoggedIn(), function(req, res){
res.render('layouts/layout');
});

app.get('/seed', SeedController.addUser);

app.post('/login', passport.authenticate('local', { successReturnToOrRedirect: '/',
   failureRedirect: '/login' }),  function(req, res) {
	console.log(req.user, req.sessionID)
  // res.send('hello');
	 res.redirect('/products/sales-manager-dashboard');
});

app.post('/logout', (req, res)=>{
  console.log(req.sessionID);
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})


// app.get('/products/add-product', function(req, res){
//   res.render('sales_manager/add_products', {layout:'main'});
// });





app.use(function(req, res, next) {
  next(createError(404));
});


app.listen(3000, () => console.log("Server started at port 3000"))
module.exports = app;
