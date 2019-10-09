var express			= require('express'),
	apk 			= express(),
	bodyParser		= require('body-parser'),
	mongoose 		= require('mongoose'),
	Movie 			= require("./models/movies.js"),
	seedDB			= require("./seeds.js"),
	passport		= require("passport"),
	LocalStrategy	= require('passport-local'),
	methodOveride	= require('method-override'),
	User			= require('./models/user.js'),
	flash 			= require('connect-flash'),
	Comment 		= require("./models/comment.js");

var commentRoutes = require("./routes/comments"),
	moviesRoutes = require("./routes/movies"),
	indexRoutes = require("./routes/index");

// seedDB();

apk.set("view engine", "ejs");
apk.use(bodyParser.urlencoded({extended: true}));
apk.use(express.static(__dirname+"/public"));
apk.use(methodOveride("_method"));
mongoose.connect("mongodb://localhost/movies3", { useNewUrlParser: true});
mongoose.set('useFindAndModify', false);
apk.use(require("express-session")({
	secret:"I have to complete this by today",
	resave:false,
	saveUninitialized:false
}));
apk.use(flash());
apk.use((request,respond,next)=>{
	respond.locals.currentUser = request.user;
	respond.locals.error =request.flash("error");
	respond.locals.success =request.flash("success");
	next();
});



//Passport Config

apk.use(passport.initialize());
apk.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

apk.use("/",indexRoutes);
apk.use("/movies",moviesRoutes);
apk.use("/movies/:id/comments",commentRoutes);


apk.get("*",(request,respond)=>{
	respond.send("Use a Valid Url");
});
apk.listen(3000,()=>{
	console.log("Movies In Progress");
	// console.log(process.env);
});