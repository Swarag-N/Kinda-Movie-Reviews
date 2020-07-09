var express = require("express"),
	router	= express.Router(),
	passport	= require("passport"),
	User			= require('../models/user.js'),
	LocalStrategy	= require('passport-local'),
	Movie 	= require("../models/movies"),
	Comment	= require("../models/comment");

//Root Route
router.get("/",function(request,respond){
	// respond.render("Space")
	respond.render("landing");
});

//Register Form
router.get("/register",(request,respond)=>{
	console.log("Registraion");
	respond.render("register",{currentUser:request.user});
});

//Sign Up Logic
router.post("/register",(request,respond)=>{
	var newUser = new User({username:request.body.username});
	User.register(newUser,request.body.password,(err,createdUser)=>{
		if(err){
			console.log(err);
			console.log(err.message);
			request.flash("error",err.message);
			return respond.redirect("register");
		}
		console.log(createdUser.username);
		request.flash("success","You Have created a account");
		passport.authenticate("local")(request,respond,()=>{respond.redirect("/movies");});
	}); 
});

//LOgin Form 
router.get("/login",(request,respond)=>{
	console.log(request.flash("error"));
	respond.render("login");
});


//apk.post("/login", middleware,callback)
router.post("/login",passport.authenticate(
	"local",{ successRedirect:"/movies",failureRedirect:"/login"}),(request,respond)=>{});

//LogOut Route
router.get("/logout",(request,respond)=>{
	request.flash("success","loged you out");
	request.logout();
	respond.redirect("/movies");
});

//middleware
function isLoggedIn( request,respond,next){
	if(request.isAuthenticated()){
		return next();
	}
	respond.render("login");
}

module.exports = router;
