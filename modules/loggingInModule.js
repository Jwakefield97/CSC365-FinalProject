"use strict"; 
//this module is used to handle user logins and registration
let fs = require("fs"),
	obj = {};
    
//returns the users from users.txt in an array of JSON objects 
let readFile = function(){
	//conent gets the buffer of data in users.txt, converts to string and creates array of objects based on newlines using a regular expression
	let content  = fs.readFileSync("./data/users.txt").toString("utf8").split(/\r\n|\r|\n/g),
		tempArr = []; //content is a buffer
	
	content.forEach(function(item){ //translates string objects into JS objects 
		if(item){
			tempArr.push(JSON.parse(item)); }
	}); 
	return tempArr; //returns the array of the users from users.txt
 
};


let deleteUsersAll = function(){
	fs.writeFile("./data/users.txt","",function(err){
		if(err){
			console.log(err); 
		}
	});
}; 

//function that appends the user to the users.txt file
let writeUser = function(user, pass){ 
	fs.appendFile("./data/users.txt", JSON.stringify({ //path has to be ./ when server is running but ../ for testing
		username: user, 
		password: pass,
		savedVideos: [] }) + "\n"); 
};

let writeUpdatedUser = function(user, pass, videos){  //used to write updated users i.e. updated video array 
	fs.appendFile("./data/users.txt", JSON.stringify({ //path has to be ./ when server is running but ../ for testing
		username: user, 
		password: pass,
		savedVideos: videos}) + "\n"); 
};
 
//function that controls user login
obj.loggingIn = function(user, pass){
	let tempArr = readFile(),
		check = false; 
	tempArr.forEach(function(item){ //if username and password matches a users in users.txt return true 
		if(item.username === user && item.password === pass){
			check = true;  
		}
	}); 
	return check; 
}; 

obj.registering = function(user, pass){
	let tempArr = readFile(),
		check = true; 
	tempArr.forEach(function(item){ //if username is not taken 
		if(item.username){
			if(item.username === user){
				check = false; 
			}
		}
	}); 
	if(check){ //if username is available 
		writeUser(user,pass); //rights user to the user.txt file 
		return true; 
	}
	else{
		return check; 
	}
};

obj.UpdateUserVideos = function(user,video){
	let usersAll = readFile(); 
	deleteUsersAll(); 
	usersAll.forEach(function(item){
		if(item.username === user){
			item.savedVideos.push(video);
			
			writeUpdatedUser(item.username,item.password,item.savedVideos); 
		}
		else{
			writeUpdatedUser(item.username,item.password,item.savedVideos); 
		}
	});
	
};

obj.getUsersVideos = function(user){
	let users = readFile(),
		tempArr = []; 
	users.forEach(function(item){
		if(user === item.username){
			tempArr.push(item.savedVideos); 
		}
	});
	return tempArr[0]; //return the array of videos associated with the user
};


module.exports = obj; 