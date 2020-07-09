var express = require("express"),
	router	= express.Router({mergeParams:true}),
	Movie 	= require("../models/movies"),
	middleware=require("../middleware"),
	Comment	= require("../models/comment");

//Comments NEW
router.get("/new",middleware.isLoggedIn,(request,respond)=>{
	Movie.findById(request.params.id,function(err,foundMovie){
	if (err){
		console.log(err);
	}else{
		console.log("Showing:=>");
		console.log("Comment to :: "+foundMovie.title);
		respond.render("comments/new",{movie:foundMovie, currentUser:request.user});
	}
	});
});

//Comments Create
router.post("/",middleware.isLoggedIn,(request,respond)=>{
	Movie.findById(request.params.id,(err,foundMovie)=>{
		if(err){
			console.log(err);
		}else{
			Comment.create(request.body.com,(err,newComment)=>{
				if(err){
					console.log(err);
				}else{
					//add usernamne and id 
					//savecoment
					newComment.author.id = request.user._id;
					newComment.author.username = request.user.username;
					newComment.save();
					foundMovie.comments.push(newComment);
					foundMovie.save();
					request.flash("success","Successfully Comment Added");
					respond.redirect("/movies/"+foundMovie._id);
				}
			});
		}
	});
});
//EDit
router.get("/:comment_id/edit",middleware.checkCommentOwnership,(request,respond)=>{
	Comment.findById(request.params.comment_id,(err,foundComment)=>{
		if(err){
			request.flash("error","Something went wrong");
			respond.redirect("back");
		}else{
			respond.render("comments/edit",{movie:request.params.id,comment:foundComment});
		}
	});
});
//Update
router.put("/:comment_id",middleware.checkCommentOwnership,(request,respond)=>{
	Comment.findByIdAndUpdate(request.params.comment_id,request.body.com,(err,updatedComment)=>{
		if(err){
			respond.redirect("back");
		}else{
			respond.redirect("/movies/"+request.params.id);
		}
	});
});
//Delete
router.delete("/:comment_id",middleware.checkCommentOwnership,(request,respond)=>{
	Comment.findByIdAndRemove(request.params.comment_id,(err)=>{
		if(err){
			console.log(err);
			respond.redirect("back");
		}else{
			request.flash("success","Successfully deleted comment");
			respond.redirect("/movies/"+request.params.id);
		}
	});
});





module.exports = router;