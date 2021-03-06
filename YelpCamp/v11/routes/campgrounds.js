var express    = require("express"),
    passport   = require("passport"),
    User       = require("../models/user"),
    Campground = require("../models/campground"),
    middleware = require("../middleware");
    
var router = express.Router({mergeParams: true});

router.get("/", function(req, res){
  Campground.find({}, function(err, allCampgrounds){
   if(err){
    console.log(err);
   } else {
    res.render("campgrounds/index", {campgrounds: allCampgrounds})
   }
  })
});

router.get("/new", middleware.isLoggedIn, function(req, res){
 res.render("campgrounds/new")
});

router.post("/", middleware.isLoggedIn, function(req, res){
 // Get name and image, and compile it into newCampground object
 var name = req.body.name;
 var image = req.body.image;
 var desc = req.body.description;
 var author = {
  id: req.user._id,
  username: req.user.username
 };
 var newCampground = {name: name, image: image, description: desc, author: author};
 
 // Create new campground in database
 Campground.create(newCampground, function(err, newlyCreated){
  if(err){
   console.log(err)
  } else{
   // redirect back to campgrounds
   
   res.redirect("/campgrounds");
  }
 });
});

router.get("/:id", function(req, res){
 Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
  if(err || !foundCampground){
   req.flash("error", "Campground not found");
   res.redirect("back");
  } else{
   res.render("campgrounds/show", {campground: foundCampground});
  }
 })
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
 Campground.findById(req.params.id, function(err, foundCampground){
  if(err || !foundCampground){
   req.flash("error", "Campground not found");
   res.redirect("back");
  } else{
   res.render("campgrounds/edit", {campground: foundCampground});
  }
 });
});

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
 Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
  if(err || !updatedCampground){
   req.flash("error", "Something went wrong");
   res.redirect("back");
  } else{
   res.redirect("/campgrounds/" + req.params.id);
  }
 });
});

//Destroy route

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
 Campground.findByIdAndRemove(req.params.id, function(err, foundCampground){
  if(err || !foundCampground){
   res.redirect("/campgrounds");
 }
 res.redirect("/campgrounds");
 });
});

module.exports = router;