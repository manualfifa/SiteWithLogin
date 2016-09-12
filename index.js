var express                 = require('express'),
    siteConfig              = require('./config/siteconfig'),
    bodyParser              = require('body-parser'),
    passport                = require('passport'),
    LocalStrategy           = require('passport-local'),
    passportLocalMongoose   = require('passport-local-mongoose'),
    expressSession          = require('express-session'),
    mongoose                = require('mongoose'),
    methodOverride          = require('method-override');
    
//--DEFINE-ROUTES--//
var homepageRoutes          = require('./routes/homepage');
    
var connection = mongoose.connect('mongodb://localhost/userauth');
    
var app = express();

app.use(expressSession({
    secret: "whataloadofbobbinsthatwas",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended:true})); //Needed for accessing form params
app.use(methodOverride('_method'));

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.siteConfig = siteConfig;
   next();
});

app.set('view engine', 'ejs');

var User = require('./models/user');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//--USE-ROUTES--//
app.use(homepageRoutes);


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.listen(process.env.PORT, process.env.IP, function () {
    console.log('League App started');
})