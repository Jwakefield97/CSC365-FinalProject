"use strict"; 
let getRequest = new XMLHttpRequest();
getRequest.open("GET", "/load_videos");
getRequest.timeout = 10 * 1000; //sets timeout to 10 seconds

getRequest.addEventListener("load", function(evt) { //on load
	if(getRequest.status >= 200 && getRequest.status < 300) { //if status code is ok
		displayVideos(JSON.parse(getRequest.responseText)); //sends the array of tweets to displayTweets 
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

let displayVideos = function(videos){ 
	let newNode = document.createElement("ul"),
		oldNode = document.getElementById("video_frame_list");
		
	newNode.setAttribute("class", "");
	newNode.id = "video_frame_list";

	videos.videoArr.forEach(function(item){
		let liNode = document.createElement("li"),
			iFrameNode = document.createElement("iframe"); 

		liNode.setAttribute("class", "");
		iFrameNode.setAttribute("class", "col-md-12"); 
		iFrameNode.setAttribute("width", oldNode.clientWidth); 
		iFrameNode.setAttribute("height","400"); 
		iFrameNode.setAttribute("src","https://www.youtube.com/embed/" + item); 
		

		liNode.appendChild(iFrameNode);
		newNode.appendChild(liNode);
	});
	oldNode.parentNode.replaceChild(newNode,oldNode);
};