//Modules used for formatting the youtube url to search youtube using the request module
"use strict"; 
let obj = {}; 
let formatSpaces = function(term){
	let str = term.toLowerCase(); 
	str = str.replace("#csc365", ""); //removes the hastag
	str = str.replace(/[^a-zA-Z0-9]/g, "");//replaces any special characters.
	str = str.replace(/\s/g, "%20");  //removes all spaces 
	return str; 
}; 
obj.formURL = function(term){
	let strF = formatSpaces(term),
		youtubeURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&key= YOUR API KEY HERE =viewcount&type=video&q="+strF+"&maxResults=1";
	
	return youtubeURL; 
}; 
module.exports = obj; 