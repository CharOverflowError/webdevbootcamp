var express  = require("express"),
    passport = require("passport"),
    User     = require("../models/user"),
    Campground = require("../models/campground");
    
var router = express.Router({mergeParams: true});

router.get("/", function(req, res){
 res.render("landing");
});

//register logic

router.get("/register", function(req, res){
 res.render("register")
});

router.post("/register", function(req, res){
 var newUser = new User({username: req.body.username});
 User.register(newUser, req.body.password, function(err, user){
  if(err){
   console.log(err);
   return res.redirect("/register");
  }
  passport.authenticate("local")(req, res, function(){
   res.redirect("/campgrounds");
  })
 })
});

//Login logic

router.get("/login", function(req, res){
 res.render("login");
});

router.post("/login", passport.authenticate("local", 
 {
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
 }), function(req, res){
 
});

//Logout route

router.get("/logout", function(req, res){
 req.logout();
 res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
 if(req.isAuthenticated()){
  return next();
 }
 res.redirect("/login");
};

module.exports = router;