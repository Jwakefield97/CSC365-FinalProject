"use strict"; 
let express = require("express"), 
	bodyParser = require("body-parser"),
	verifyCred = require("./modules/loggingInModule.js"),//my own module for verifying credentials 
	Twitter = require("twitter"),
	apiCred = require("./modules/apiCred.js"),
	urlFormat = require("./modules/formatURL.js"), 
	app = express(),
	request = require("request"),   
	passport = require("passport"), //used for logins and sessions
	cookieParser = require("cookie-parser"),//used for logins and sessions
	expressSession = require("express-session"),//used for logins and sessions
	LocalStrategy = require("passport-local").Strategy, //used for logins and sessions
	objL = {          //obj used to fill out the login template to make it  the login page 
		title: "Login",
		bottomMessage: "Don't have an account? Click the register tab!",
		homeTab: "login",
		secondaryTab: "Register", 
		submitButton: "Login",
		homeTabPath: "/",
		secondaryTabPath: "/create_account",
		httpAction: "/login_attempt"
	},
	objR = {               //object used to fill out the login template to make it the register page
		title: "Register",
		bottomMessage: "After creating an account, you will be redirected to the login page.",
		homeTab: "Register",
		secondaryTab: "Login", 
		submitButton: "Register",
		homeTabPath: "/create_account",
		secondaryTabPath: "/",
		httpAction: "/register_attempt"
	};

//all app.use goes here
app.use(express.static("resources"));
app.use(cookieParser()); 
app.use(expressSession({  //always goes before passport or it does weird things
	secret: "ThisIsSuperSecretDontTellAnyone",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new LocalStrategy({usernameField: "username",passwordField: "password"},
	function(username,password,done){
		if(!verifyCred.loggingIn(username, password)){ //if failed login
			return done(null, false, {
				message: "Incorrect username of password"
			});
		}
		return done(null, {
			user: username
		});
	
	})
);

passport.serializeUser(function(user,done){
	done(null,user.user);
});
passport.deserializeUser(function(id,done){
	done(null,{
		user: id,
	});
});

 // Create Middleware to prevent users from accessing pages without permission
let ensureAuthenticated = function(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	else {
		res.redirect("/");
	}
};
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); 

//all of the app.set
app.set("view engine","pug");//sets view engine  
app.set("views", "./views");  //tells view engine where to look for templates 

//used for logging out
app.get("/logout", function(req,res){
	req.logout();
	res.redirect("/"); 
});


//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! START OF ALL GET AND POSTS FOR PROFILE PAGE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.get("/profile", ensureAuthenticated, function(req,res){
	res.render("profile.pug"); 
});

app.get("/load_videos", ensureAuthenticated, function(req,res){
	let videos = verifyCred.getUsersVideos(req.session.passport.user),
		obj = {
			videoArr: videos
		};
	if(videos.length > 0){
		res.json(obj); 
	}

});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! END OF ALL GET AND POSTS FOR PROFILE PAGE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! START OF ALL GET AND POSTS FOR SPLASH PAGE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.get("/homepage", ensureAuthenticated, function(req,res){ //renders the authenticated users homepage
	//!!!!!!!MAKE SURE YOU AUTHENTICATE USERS BEFORE RENDERING THIS PAGE!!!!!!!!!!!!!!!!!
	res.render("splash.pug"); 
}); 

app.get("/get_tweets",ensureAuthenticated,function(req,res){ //get used for getting tweets to display on the webpage 
	//send back the tweets in an array 
	let client = new Twitter({
		consumer_key: apiCred.consumer_key,
		consumer_secret: apiCred.consumer_secret,
		access_token_key: apiCred.access_token_key,
		access_token_secret: apiCred.access_token_secret
	});

	client.get("search/tweets", {q: "#csc365"}, function(error, tweets) { //gets all of the tweets that use #csc365
		let tempArray = [],
			obj = {
				tweetArr: tempArray
			}; 
		//set interval so that it grabs tweets on a time interval 
		tweets.statuses.forEach(function(tweet){
			
			tempArray.push(tweet.text); 
		}); 

		res.json(obj); //sends a JS object that contains an array of the tweets 
	});

});

app.get("/getVideoId", ensureAuthenticated, function(req,res){
//make the youtube api call here and return only the id for the video. 
	let url = urlFormat.formURL(req.query.videoId);
	request(url, function(error, response, body) { //first param is left blank intentionally to search all videos on youtube.
		let	obj = {
				id: "empty"
			},
			result = JSON.parse(body); 
		
		result.items.forEach(function(item){
			
			obj.id = item["id"]["videoId"]; //gets the video id
		});
		
		//send the array of video titles back to ajax using res.json(). make sure it is in object form   
		res.json(obj);
	});
}); 

app.get("/save_video_id", ensureAuthenticated,function(req,res){
	verifyCred.UpdateUserVideos(req.session.passport.user, req.query.id); //updates the video ids in text file based on user name. 
	res.send("ok");  
}); 

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! END OF ALL GET AND POSTS FOR SPLASH PAGE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! START OF ALL GET AND POSTS FOR LOGIN/REGISTER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//all of the app.gets
app.get("/", function(req,res){ //homepage also login screen 
	res.render("loginTemp.pug",objL); 
}); 

app.get("/create_account", function(req,res){ //register page
	res.render("loginTemp.pug",objR);
});

app.post("/login_attempt", passport.authenticate("local",{
	failureRedirect: "/",
	successRedirect: "/homepage"
}));
//all of the app.posts
app.post("/register_attempt", function(req,res){ //post for registering.
	let tempObjR = objR, 
		cred = {   //stores the users credentials from the request in an object to check later.
			username: req.body.username,
			password: req.body.password
		}; 

	tempObjR.bottomMessage = "ACCOUNT ALREADY EXISTS! TRY AGAIN."; 

	if(verifyCred.registering(cred.username, cred.password)){ //if user name is available create user, and redirect to login page
		res.redirect("/"); //redirects to the home page to login with the newly created account
	}
	else{                         //else try and register again. 
		res.render("loginTemp.pug", tempObjR);
	}
    
}); 
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! END OF ALL GET AND POSTS FOR LOGIN/REGISTER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.listen(3000, function(){console.log("Listening on port 3000");}); 

