var express = require("express"),
	router	= express.Router(),
	middleware=require("../middleware"),
	Movie 	= require("../models/movies");
// Index Page 
router.get("/",(request,respond)=>{
	Movie.find(function(err,movie){
				if(err)
					{
				console.log(err);
					}else{
			   respond.render("movies/index",{ list:movie, currentUser:request.user});
				}
			});
});
		
// Create Page
router.post("/",middleware.isLoggedIn,(request,respond)=>{
	// respond.send("Hello the POst Route");
	var nMovie = request.body.mName;
	var nUrl = request.body.mUrl;
	var nDesciption = request.body.mDescription;
	var nAuthor ={
		id: request.user._id,
		username : request.user.username
	};
	var nMlist = {
		title:nMovie,
		url:nUrl,
		description:nDesciption,
		author:nAuthor
	};
	Movie.create(nMlist,(err,New_movie)=>{
		if(err){
			console.log("Error While adding Data To Db");
		}
	});
	request.flash("success","Movie Added");
	respond.redirect("/movies");
});

// New Page
router.get("/new",middleware.isLoggedIn,(request,respond)=>{
	respond.render("movies/new",{ currentUser:request.user});
});

// Show Page
router.get("/:movieId",(request,respond)=>{
	Movie.findById(request.params.movieId).populate("comments").exec(function(err,foundMovie){
		if (err){
		console.log(err);
	}else{
		respond.render("movies/show",{movie:foundMovie, currentUser:request.user});
	}
	});
});
// Edit Details
router.get("/:id/edit",middleware.checkMovieOwnership,(request,respond)=>{
	Movie.findById(request.params.id,(err,foundMovie)=>{
		respond.render("movies/edit",{movie:foundMovie});
	} );
});
//Backend
router.put("/:id",middleware.checkMovieOwnership,(request,respond)=>{
	Movie.findByIdAndUpdate(request.params.id,request.body.m,(err,updatedMovie)=>{
		if(err){
			respond.redirect("/movies");
		}else{
			// console.log(request.body.m);
			// console.log(updatedMovie);
			request.flash("success","Movie Edited");
			respond.redirect("/movies/"+updatedMovie._id);
		}
	});
});
// Delete The Movie
router.delete("/:id",middleware.checkMovieOwnership,(request,respond)=>{
	Movie.findByIdAndRemove(request.params.id,(err)=>{
		if(err){
			respond.redirect("/movies");
			console.log(err);
		}else{
			request.flash("success","Deleted");
			respond.redirect("/movies");
		}
	});
	// respond.send("you are trying to delete");
});



module.exports = router;