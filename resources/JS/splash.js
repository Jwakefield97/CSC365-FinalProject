"use strict";
let getTweet = function() { //ajax function that gets the current list of youtube videos
	let getRequest = new XMLHttpRequest();
	getRequest.open("GET", "/get_tweets");
	getRequest.timeout = 10 * 1000; //sets timeout to 10 seconds

	getRequest.addEventListener("loadstart", function(){
		loadingGif(); 
	});

	getRequest.addEventListener("load", function(evt) { //on load
		if(getRequest.status >= 200 && getRequest.status < 300) { //if status code is ok
			displayTweets(getRequest.responseText); //sends the array of tweets to displayTweets 
		}
		else {
			console.log(evt); 
		}
	});
	getRequest.addEventListener("error", function(evt){
		console.log(evt); 
	});
	getRequest.addEventListener("timeout", function(evt){
		console.log(evt); 
	});
 
	getRequest.send();
};

let displayTweets = function(tweets) { //function used to create the list of tweeets in the tweet box on the page
	let res = JSON.parse(tweets),
		tweetArr = res.tweetArr, 
		newNode = document.createElement("ul"),
		oldNode = document.getElementById("tweet_list");
		
	newNode.setAttribute("class", "list-group");
	newNode.id = "tweet_list";
	
	tweetArr.forEach(function(item){  // for each tweet create a list element with a play and save button 
		let playImgNode = document.createElement("img"),
			saveImgNode = document.createElement("img"); 

		playImgNode.setAttribute("src","/images/playButton.jpg"); //play button to 
		playImgNode.setAttribute("alt","Play Button"); 
		playImgNode.setAttribute("hieght","25"); 
		playImgNode.setAttribute("width","25"); 
		playImgNode.setAttribute("id", item);
		playImgNode.setAttribute("class", "playButton");

		saveImgNode.setAttribute("src","/images/saveButton.svg"); //save button 
		saveImgNode.setAttribute("alt","Play Button"); 
		saveImgNode.setAttribute("hieght","25"); 
		saveImgNode.setAttribute("width","25"); 
		saveImgNode.setAttribute("id", item + "s"); //the save makes it unique to the save id
		saveImgNode.setAttribute("class", "saveButton");
		
		let liNode = document.createElement("li"),
			text = document.createTextNode("  "+item);

		liNode.setAttribute("class", "list-group-item");
		liNode.appendChild(playImgNode);
		liNode.appendChild(saveImgNode);
		liNode.appendChild(text);
		newNode.appendChild(liNode);
	});
	oldNode.parentNode.replaceChild(newNode,oldNode);
	
	let play = document.getElementsByClassName("playButton"),
		save = document.getElementsByClassName("saveButton"); //this block of codes adds event listeners on all of the play buttons for the webpage
	
	for(let i = 0; i<play.length; i++){          //remove the previous event listeners 
		play[i].removeEventListener("click", getVideoId); 
		save[i].removeEventListener("click", saveVid); 
	}
	for(let i = 0; i<play.length; i++){  //add the new event lisenters 
		play[i].addEventListener("click", getVideoId); 
		save[i].addEventListener("click", saveVid); 
	}
};

let loadingGif = function() {  //function that displays the loading gif while ajax waits for the servers response
	let newNode = document.createElement("ul"),
		oldNode = document.getElementById("tweet_list"),
		liNode = document.createElement("li"),
		imgNode = document.createElement("img");
	newNode.setAttribute("class", "list-group");
	newNode.id = "tweet_list";
	liNode.setAttribute("class", "list-group-item"); 
	imgNode.setAttribute("src", "/images/loadingGif.svg");
	imgNode.setAttribute("alt", "Loading Image");

	imgNode.setAttribute("hieght", "50"); 
	imgNode.setAttribute("width", "50");
	
	liNode.appendChild(imgNode); 
	newNode.appendChild(liNode); 
	oldNode.parentNode.replaceChild(newNode,oldNode);
}; 

let getVideoId = function(evt) { //ajax function that gets the current list of youtube videos. takes the event that called it 
	
	let iDRequest = new XMLHttpRequest(),
		frame = document.getElementById("video_frame"),
		saveImg = document.getElementById(evt.target.id + "s"),
		playImg = document.getElementById(evt.target.id); //get the saveImg element. "s" indicates save 
	iDRequest.open("GET", "/getVideoId?videoId="+evt.target.id); //sends the tweet in a query parameter
	iDRequest.timeout = 10 * 1000; //sets timeout to 10 seconds

	iDRequest.addEventListener("load", function(evt) { //on load
		if(iDRequest.status >= 200 && iDRequest.status < 300) { //if status code is ok
			let text = JSON.parse(iDRequest.responseText); //the id of the video 
				 
			if(!VidMasterArr.includes(text.id)){ //if the id is not in the array set saveImg id and push to array. 

				saveImg.setAttribute("id", text.id); //set the id of the saveImage so that if they choose to save the video i can get the id
				VidMasterArr.push(text.id); //add the video id
			}

			frame.setAttribute("src", "https://www.youtube.com/embed/" + text.id); //change the video on the page 
		}
		else {
			console.log(evt); 
		}
	});
	iDRequest.addEventListener("error", function(evt){
		console.log(evt); 
	});
	iDRequest.addEventListener("timeout", function(evt){
		console.log(evt); 
	});
 
	iDRequest.send(); 
};

let saveVid = function(evt){
	let saveRequest = new XMLHttpRequest();
	saveRequest.open("GET", "/save_video_id?id=" + evt.target.id);
	saveRequest.timeout = 10 * 1000; //sets timeout to 10 seconds

	saveRequest.addEventListener("load", function(evt) { //on load
		if(!saveRequest.status >= 200 && saveRequest.status < 300) { //if status code is ok
			console.log(evt); 
		}
	});
	saveRequest.addEventListener("error", function(evt){
		console.log(evt); 
	});
	saveRequest.addEventListener("timeout", function(evt){
		console.log(evt); 
	});
 
	saveRequest.send(); 
};


let VidMasterArr = []; //array for storing the ids of the youtube videos 


getTweet(); 
document.getElementById("refresh_tweets").addEventListener("click", getTweet); //if the user clicks the refresh button, refresh the tweets 


