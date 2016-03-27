var express = require('express');
var router = express.Router();
var path    = require("path");
var sqlite3 = require('sqlite3').verbose();
var Post = require('../modules/post.js');
var db = global.db;
var sha1 = require('sha1');

router.get('/', function(req, res, next) {
    if (req.session.user == null) {
        res.redirect("/login");
    } else {
        res.redirect("/feed");
    }
});

router.get('/register', function(req, res, next) {
    
    res.sendFile(path.join(__dirname+'/html/register.html'));
});

router.post('/register', function(req, res, next) {
    console.log("REGISTER USER "+JSON.stringify(req.body));
    var stmt = db.prepare("INSERT INTO `users`(`username`,`password_hash`,`email`) VALUES (?, ?, ?);", [req.body.inputUsername, sha1(req.body.inputPassword), req.body.inputEmail]);
    stmt.run(function(err){
        if (err)
                console.log(err);
        res.redirect("/login");
    });
    
    //res.sendFile(path.join(__dirname+'/html/register.html'));
});

router.get('/login', function(req, res, next) {
    if (req.session.user == null) {
        res.render('login', {title: ""});
    } else {
        res.redirect("/feed");
    }
});

router.post('/login', function(req, res, next) {
    console.log("LOGIN USER "+JSON.stringify(req.body));
    if (req.body.inputUsername != null && req.body.inputPassword != null){
        var stmt = db.prepare("SELECT id, username, password_hash, is_admin FROM users WHERE username = ?", req.body.inputUsername);
        stmt.get(function(err, row) {
            if (err)
                console.log(err);
            if (row && row.password_hash == sha1(req.body.inputPassword)) {
                console.log("login successful");
                req.session.user = {};
                req.session.user.userid = row.id;
                req.session.user.username = row.username;
                req.session.user.is_admin = row.is_admin;
                res.redirect("/feed");
            } else {
                console.log(JSON.stringify(row.password_hash));
                console.log(JSON.stringify(sha1(req.body.inputPassword)));
                res.render('login', {title: "Invalid credentials"});
            }
        });
    } else {
        res.render('login', {title: "invalid input"});
    }
});

router.use(function(req, res, next) {
    if (req.session.user == null) {
        res.redirect("/login");
    } else {
        next();
    }
});

/*
 * Everything after here logged in users only
 */

router.get('/feed', function(req, res, next) {
    if (req.session.user != null) {
        //res.render('ajaxfeed', {username: req.session.user.username});
        console.log("GET FEED");
        var numPosts;
        var numDonePosts = 0;
        var posts = [];
        db.all("SELECT posts.id, title, posts.time, body, username, sum(vote) AS score FROM posts JOIN users ON (posted_by = users.id) JOIN post_votes ON (posts.id = post_id) GROUP BY posts.id ORDER BY posts.id DESC LIMIT 10;", function(err, rows){
            if (err)
                console.log(err);
            if (rows == 0) {
                var params = {username: req.session.user.username, posts: [], message: "No posts"};
                res.render('postlist', params)
            }
            numPosts = rows.length;
            //console.log(rows);
            for (i = 0; i < rows.length; i++) { 
               posts[i] = new Post(rows[i], req.session.user, function() {
                    numDonePosts++;
                    if (numPosts == numDonePosts) {
                        //res.send(JSON.stringify(posts));
                        var params = {username: req.session.user.username, posts: posts, feedPageNum: 1};
                        //console.log(params);
                        res.render('postlist', params);
                    } 
                });

            }
        });
    } else {
        res.redirect("/login");
    }
});

router.get('/feed/page/:pagenum', function(req, res, next) {
    
    if (req.session.user != null) {
        //res.render('ajaxfeed', {username: req.session.user.username});
        console.log("GET FEED");
        var numPosts;
        var numDonePosts = 0;
        var posts = [];
        var startPost = parseInt((parseInt(req.params.pagenum)*10)-10);
//        console.log(startPost);
//        console.log(JSON.stringify(req.params.pagenum));
        db.all("SELECT posts.id, title, posts.time, body, username, sum(vote) AS score FROM posts JOIN users ON (posted_by = users.id) JOIN post_votes ON (posts.id = post_id) GROUP BY posts.id ORDER BY posts.id DESC LIMIT ?, 10 ", startPost, function(err, rows){
            if (err)
                console.log(err);
            if (rows == 0) {
                var params = {username: req.session.user.username, posts: [], message: "No posts", feedPageNum: req.params.pagenum};
                res.render('postlist', params)
            }
            numPosts = rows.length;
            //console.log(rows);
            for (i = 0; i < rows.length; i++) { 
               posts[i] = new Post(rows[i], req.session.user, function() {
                    numDonePosts++;
                    if (numPosts == numDonePosts) {
                        //res.send(JSON.stringify(posts));
                        var params = {username: req.session.user.username, posts: posts, feedPageNum: req.params.pagenum};
                        //console.log(params);
                        res.render('postlist', params);
                    } 
                });

            }
        });
    } else {
        res.redirect("/login");
    }
});

router.post('/submitPost', function(req, res, next) {
    console.log("SUBMIT POST "+JSON.stringify(req.body, 3));
    if (req.session.user != null && req.body.postTitle != null && req.body.postBody != null) {
        var stmt = db.prepare("INSERT INTO posts (title, body, posted_by) VALUES (?, ?, ?);", [req.body.postTitle, req.body.postBody, req.session.user.userid]);
        stmt.run(function(err){
            if (err)
                console.log(err)

            res.redirect("/feed");
            //res.render('feed', {username: req.session.username});
        });
    } else {
        res.redirect("/login");
    }
});



router.get('/post/:postid', function(req, res, next) {
    var stmt = db.prepare("SELECT posts.id, title, posts.time, body, username, sum(vote) AS score FROM posts JOIN users ON (posted_by = users.id) JOIN post_votes ON (posts.id = post_id) WHERE posts.id = ?", req.params.postid);
    stmt.get(function(err, post) {
            post = new Post(post, req.session.user, function() {
                post.addReplies(req.session.user, function() {
                    console.log("here");
                    var params = {username: req.session.user.username, post: post, replies: post.replies};
                    //console.log(params);
                    res.render('post', params);
                });
            });
    });
});

router.post('/post/:postid/reply', function(req, res, next) {
    console.log("REPLY TO POST "+JSON.stringify(req.body, 3));
    if (req.session.user.userid != null && req.params.postid > 0 && req.body.replyBody != null) {
        var stmt = db.prepare("INSERT INTO post_replies (reply_to, body, posted_by) VALUES (?, ?, ?);", [req.params.postid, req.body.replyBody, req.session.user.userid]);
        stmt.run(function(err){
            if (err)
                console.log(err);
            // add error handling
            res.redirect("/post/"+req.params.postid);
        });
    } else {
        res.redirect("/feed");
    }
});

router.post('/post/:postid/delete', function(req, res, next) {
    console.log("DELETE POST");
    var stmt = db.prepare("DELETE FROM posts WHERE id=? AND posted_by=?;", [req.params.postid, req.session.user.userid]);
    stmt.run(function(err){
        if (err)
            console.log(err);
        res.redirect("/feed");
    });
});

router.post('/reply/:replyid/delete', function(req, res, next) {
    console.log("DELETE REPLY");
    var stmt = db.prepare("DELETE FROM post_replies WHERE id=? AND posted_by=?;", [req.params.replyid, req.session.user.userid]);
    stmt.run(function(err){
        if (err)
            console.log(err);
        res.redirect("/feed");
    });
});

router.get('/search', function(req, res, next) {
    console.log("GET POSTS FOR SEARCHKEY "+req.query.searchkey);
    var numPosts;
    var numDonePosts = 0;
    var posts = [];
    db.all("SELECT posts.id, title, posts.time, body, username, sum(vote) AS score FROM posts  JOIN users ON (posted_by = users.id) JOIN post_votes ON (posts.id = post_id) GROUP BY posts.id HAVING (title LIKE ? OR body LIKE ?) ORDER BY posts.id DESC LIMIT 10", ["%"+req.query.searchkey+"%", "%"+req.query.searchkey+"%"], function(err, rows){
        if (err)
            console.log(err);
        if (rows == 0) {
            var params = {username: req.session.user.username, posts: [], message: "No posts matching \""+req.query.searchkey+'"'};
            res.render('postlist', params)
        }
        numPosts = rows.length;
        //console.log(rows);
        for (i = 0; i < rows.length; i++) { 
           posts[i] = new Post(rows[i], req.session.user, function() {
                numDonePosts++;
                if (numPosts == numDonePosts) {
                    var params = {username: req.session.user.username, posts: posts, message: "Posts matching \""+req.query.searchkey+'"'};
                    //console.log(params);
                    res.render('postlist', params);
                    //res.render(JSON.stringify(posts));
                } 
            });
            
        }
    });
});

module.exports = router;
