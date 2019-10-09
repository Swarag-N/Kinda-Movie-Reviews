var mongoose = require("mongoose");
var Movie = require("./models/movies.js");
var Comment = require("./models/comment.js");


var newComment ={
	text:"Harry Potter Series Is Nice :)",
	author:"J K Rowling"
};

var data =[
	{title:"Harry Potter and the Half-Blood Prince Harry",
	url:"https://www.harrypotterfanzone.com/wp-content/2015/07/half-blood-prince-harry-and-ginny-poster.jpg",
	description:"Dumbledore and Harry Potter learn more about Voldemort's past and his rise to power. Meanwhile, Harry stumbles upon an old potions textbook belonging to a person calling himself the Half-Blood Prince."
	},
	{title:"Harry Potter and the Order of the Phoenix ",
	url:"https://www.harrypotterfanzone.com/wp-content/2015/07/order-of-the-phoenix-theatrical-poster-3.jpg",
	description:"Harry Potter and Dumbledore's warning about the return of Lord Voldemort is not heeded by the wizard authorities who, in turn, look to undermine Dumbledore's authority at Hogwarts and discredit Harry."
	},
	{title:"Harry Potter and the Goblet of Fire ",
	url:"https://www.harrypotterfanzone.com/wp-content/2015/07/goblet-of-fire-theatrical-poster-2.jpg",
	description:"In his fourth year at Hogwarts, Harry is unwittingly selected to compete in the inter-school Triwizard Tournament. Meanwhile, the wizarding world remains unaware of the ominous rise of dark forces."
	},
];

function seedDB(){
	Movie.remove({},(err)=>{
	if(err){
		console.log(err);
	}else{
		console.log("Movies Removed");console.log("===========================");
		data.forEach((seed)=>{
		Movie.create(seed,(err,pushedMovie)=>{
			if(err){
				console.log(err);
			}else{
				console.log(pushedMovie.title);
				console.log("====================");
				Comment.create(
					{
						text:"Harry Potter Series Is Nice :)",
						author:"J K Rowling"
					},function(err,commentAdded){
						if(err){
							console.log(err);
						}else{
							console.log(commentAdded);
							console.log(commentAdded.author);
							console.log(typeof(pushedMovie));
							console.log(typeof(commentAdded));
							pushedMovie.comments.push(commentAdded);
							pushedMovie.save();
							console.log("====================");
						}
					}
				);
			}
		});
	});
	}
	});
}

module.exports = seedDB;