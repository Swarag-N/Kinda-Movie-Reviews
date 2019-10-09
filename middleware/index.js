var middlewareObject = {},
	Movie 	= require("../models/movies"),
	Comment	= require("../models/comment");


middlewareObject.checkMovieOwnership =function (request,respond,next){
	if(request.isAuthenticated()){
		Movie.findById(request.params.id,(err,foundMovie)=>{
			if(err){
				console.log(err);
				request.flash("error","Movie Not Found");
				respond.redirect("back");
			}else{
				if(foundMovie.author.id.equals(request.user._id)){
				    if (!foundMovie) {
                    request.flash("error", "Item not found.");
                    return respond.redirect("back");
                }
				next();
				}else{
					request.flash("error","you dont have permission");
					respond.redirect("back");
				}
			}
		});
	}else{
	request.flash("error","Login Required");
	respond.redirect("back");}
};

middlewareObject.checkCommentOwnership=function (request,respond,next){
	if(request.isAuthenticated()){
		Comment.findById(request.params.comment_id,(err,foundComment)=>{
			if(err){
				console.log(err);
				respond.redirect("back");
			}else{
				if(foundComment.author.id.equals(request.user._id)){
				next();
				}else{
					request.flash("error","you dont have permission");
					respond.redirect("back");
				}
			}
		});
	}else{	
		request.flash("error","Login Required");
		respond.redirect("back");
	} 
};

//midleware
middlewareObject.isLoggedIn = function ( request,respond,next){
	if(request.isAuthenticated()){
		return next();
	}
	console.log("you reched to add movies without logginin");
	request.flash("error","Login Required");
	respond.redirect("/login");
};

module.exports= middlewareObject;