var express = require('express');
var router = express.Router();
var url = require('url');
var Post = require('../modules/post.js');

var db = global.db;

/*
 * Get all songs
 */

router.all('/post/get/feed', function(req, res, next) {
    console.log("GET POSTS FOR FEED");
    var numPosts;
    var numDonePosts = 0;
    var posts = [];
    db.all("SELECT posts.id, title, posts.time, body, username, sum(vote) AS score FROM posts JOIN users ON (posted_by = users.id) JOIN post_votes ON (posts.id = post_id) GROUP BY posts.id ORDER BY posts.id DESC LIMIT 25;", function(err, rows){
        numPosts = rows.length;
        //console.log(rows);
        for (i = 0; i < rows.length; i++) { 
           posts[i] = new Post(rows[i], req.session.user, function() {
                numDonePosts++;
                if (numPosts == numDonePosts) {
                  res.send(JSON.stringify(posts));
                } 
            });
            
        }
    });
});

router.post('/user/username-free', function(req, res, next) {
    console.log("CHECK IF USERNAME FREE "+ JSON.stringify(req.body));
    var stmt = db.prepare("SELECT id FROM users WHERE username= ?", req.body.username);
    //console.log(stmt);
    stmt.get(function(err, row) {
        if (row == null) {
            res.send(JSON.stringify({isFree: true}));
        } else {
            res.send(JSON.stringify({isFree: false}));
        }
    });
});

router.post('/post/vote', function(req, res, next) {
    console.log("Vote on post "+JSON.stringify(req.body));
    var stmt = db.prepare("INSERT INTO post_votes (post_id, user_id, vote) VALUES (?, ?, ?);", [req.body.postid, req.session.user.userid, req.body.vote]);
    
    //console.log(JSON.stringify(stmt));
    
    stmt.run(function(err){
       if (err) {
            if (err.code = 'SQLITE_CONSTRAINT') {    // Vote exists, update instead
                var stmt2 = db.prepare("UPDATE post_votes SET vote=? WHERE post_id=? AND user_id=?;", [req.body.vote, req.body.postid, req.session.user.userid]);
                stmt2.run(function(err){
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify({success: false}));
                    } else {
                        res.send(JSON.stringify({success: true}));
                    }
                });
            } else {
                console.log(err);
                res.send(JSON.stringify({success: false}));
            }
       } else {
           res.send(JSON.stringify({success: true}));
       }
       
    });
    
});

router.post('/reply/vote', function(req, res, next) {
    console.log("Vote on reply "+JSON.stringify(req.body));
    var stmt = db.prepare("INSERT INTO reply_votes (reply_id, user_id, vote) VALUES (?, ?, ?);", [req.body.replyid, req.session.user.userid, req.body.vote]);
    
    //console.log(JSON.stringify(stmt));
    
    stmt.run(function(err){
       if (err) {
            if (err.code = 'SQLITE_CONSTRAINT') {    // Vote exists, update instead
                var stmt2 = db.prepare("UPDATE reply_votes SET vote=? WHERE reply_id=? AND user_id=?;", [req.body.vote, req.body.replyid, req.session.user.userid]);
                stmt2.run(function(err){
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify({success: false}));
                    } else {
                        res.send(JSON.stringify({success: true}));
                    }
                });
            } else {
                console.log(err);
                res.send(JSON.stringify({success: false}));
            }
       } else {
           res.send(JSON.stringify({success: true}));
       }
       
    });
    
});

//router.get('/song/get/bybook/:bookcode', function(req, res, next) {     
//    console.log("GET SONGS IN BOOK "+req.params.bookcode);
//    var stmt = db.prepare("SELECT * FROM songs WHERE bookcode= ?", req.params.bookcode);
//    stmt.all(function(err, rows){
//        if (err) console.log(JSON.stringify(err, 3));
//        
//        res.send(JSON.stringify(rows));
//    });
//});
//
//router.get('/song/get/search', function(req, res, next) {     
//    console.log("SEARCH SONGS "+JSON.stringify(req.query));
//    
//    var search = "%" + req.query.searchKey + "%";
//    var stmt;
//    if (req.query.bookcode) {
//        stmt = db.prepare("SELECT * FROM songs WHERE title LIKE ? AND bookcode= ?", search, req.query.bookcode);
//    } else {
//        stmt = db.prepare("SELECT * FROM songs WHERE title LIKE ?", search);
//    }
//    
//    stmt.all(function(err, rows){
//        if (err) console.log(JSON.stringify(err, 3));
//        res.send(JSON.stringify(rows));
//    });
//});
//
//router.post('/song/update/:songid', function(req, res, next) {       
//    console.log("UPDATE SONG "+req.params.songid + JSON.stringify(req.body));
//    var stmt = db.prepare("UPDATE songs SET bookcode= ?, page= ?, title= ? WHERE id= ?", req.body.bookCode, req.body.page, req.body.title, req.params.songid);
//    stmt.run(function(err){
//        if (err) console.log(JSON.stringify(err, 3));
//        res.send(JSON.stringify({success: true}));//JSON.stringify(rows));
//    });
//});
//
//router.get('/song/delete/:songid', function(req, res, next) {       
//    console.log("DELETE SONG "+req.params.songid );
//    var stmt = db.prepare("DELETE FROM songs WHERE id= ?", req.params.songid);
//    stmt.run(function(err){
//        if (err) console.log(JSON.stringify(err, 3));
//        res.send(JSON.stringify({success: true}));//JSON.stringify(rows));
//    });
//});
//
///*
// * Get all books
// */
//router.get('/book/get/all', function(req, res, next) {
//    console.log("GET ALL BOOK DETAILS");
//    
//    db.all("SELECT code, title FROM bookcodes", function(err, rows){
//        res.send(JSON.stringify(rows));
//    });
//});

module.exports = router;
