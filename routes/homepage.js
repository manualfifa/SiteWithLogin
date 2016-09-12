var express     = require('express'),
    router      = express.Router(),
    User        = require('../models/user'),
    passport                = require('passport');

router.get('/', function (req, res) {
   res.render("./partials/home"); 
});

router.get('/register', function (req, res){
    res.render("./partials/register");
});

router.post('/register', function (req, res){
    User.register(new User({username: req.body.username}), req.body.password, function (err, user){
        if(err){
		    console.log(err);
		    return res.render('./partials/register');
	    }
	    passport.authenticate("local")(req, res, function(){
		    res.redirect("/");
	    });
    });
});
   

router.get('/login', function (req,res){
    res.render("./partials/login");
});

router.post('/login', passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect: "/login"
}), function(req, res){
});

router.get('/logout', function(req,res){
    req.logout();
    res.redirect('/');
});

module.exports = router;