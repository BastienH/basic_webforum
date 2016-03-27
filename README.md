# basic_webforum

Project for COMP3005 - databases (specifically sqlite)

This is a web forum with upvotes/downvotes, and replies

Nodejs/express, sqlite, bootstrap


#Assignment readme

A music form designed in nodejs.
A copy of the database called a4.db can be found in root of this zip as a4.db, but the copy used by the app is in A4-express/bin/a4.db

the db_schema.sql contains the code to initialize the db

Launch instructions:

npm version 3.6.0
nodejs v5.7.0
 
with nodejs and npm installed on host machine, run the following in terminal in the A4-express folder:

	npm install
	npm start
	
Now you can connect with a browser to http://localhost:3000 to access the app

The main page will show a login prompt, click register to create an account or login with carter3/password1

A list of posts will be shown, there is a submit post button at the top which will show a form to submit.
There is a text field and a search button to make a search query.

Clicking on a posts title or number of replies will show the replies

a user can delete their own posts or replies
