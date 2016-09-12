var express                 = require('express'),
    siteConfig              = require('./config/siteconfig'),
    bodyParser              = require('body-parser'),
    passport                = require('passport'),
    LocalStrategy           = require('passport-local'),
    passportLocalMongoose   = require('passport-local-mongoose'),
    expressSession          = require('express-session'),
    mongoose                = require('mongoose'),
    methodOverride          = require('method-override');
    
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

//--ROUTES--//

app.get('/', function (req, res) {
    console.log(siteConfig);
   res.render("./partials/home"); 
});

app.get('/register', function (req, res){
    res.render("./partials/register");
});

app.post('/register', function (req, res){
    User.register(new User({username: req.body.username}), req.body.password, function (err, user){
        if(err){
		    console.log(err);
		    return res.render('./partials/register');
	    }
	    passport.authenticate("local")(req, res, function(){
		    res.redirect("./partials/secret");
	    });
    });
});
   

app.get('/login', function (req,res){
    res.render("./partials/login");
});

app.post('/login', passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect: "/login"
}), function(req, res){
});

app.get('/logout', function(req,res){
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.listen(process.env.PORT, process.env.IP, function () {
    console.log('League App started');
})