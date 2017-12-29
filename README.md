# CSC365-FinalProject
Final project for CSC365 Internet programming; taken in spring of 2017. 

# What it is
  This project allows users to tweet a search term for a youtube video with the hashtag "#CSC365" and view it on this website. They will also be able to view previous search terms. They can save the video to their profile to view later. Due to limitations on the runtime environment I could not implement a database with this project so I made my own filesystem database.  

# To run this project: 
  * Place your youtube api credentials in the file modules/formatURL.js where it says "YOUR API CRED HERE"
  * Place your twitter api credentials in the file modules/apiCred.js. 
  * Run the command "npm install" to install the necessary dependencies.
  
# Project contraints
  * Use Twitter api in a dynamic way. 
  * Implement custom login or Facebook/Twitter login. 
  * Has to be written in Nodejs. 
  * Have at least two templates with one master template that the others inherit from.
  * Has to use ajax. 
  * Can not crash while testing (other clashmates can tweet malicious code). 
  
