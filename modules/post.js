var sqlite3 = require('sqlite3').verbose();
var Reply = require('./reply.js');
var db = global.db;

/*
 * Constructor call with data from the db row
 * If the getReplies is set to true then the constructor will also fetch an array
 * of replies, if false then it will just fetch the number
 * 
 * The constructor will call the callback when all database queries have finished
 */
function Post(row, user, callback) {
  
    this.data = row;
    this.data.time = this.data.time + "+00:00"; // Fix for timestamps in UTC
    this.data.myvote = 0;
    this.data.numreplies = 0;
    
    if (this.data.username === user.username)
        this.data.editable = true;
    else
        this.data.editable = false;
    
    this.replies = [];
    var self = this;
  
    var NUM_ASYNC_CALLS = 2;    // number of async calls done in this constructor
    var asyncCallsDone = 0;     // each async call increments this when done
    
    function checkDone() {      // called after each async call, executes the call back when the last one finishes
        asyncCallsDone++;
        if (asyncCallsDone >= NUM_ASYNC_CALLS) {
            //console.log("Finished constructor for "+JSON.stringify(self, 3));
            callback();
        }
    }
    
    var stmt1 = db.prepare("SELECT vote FROM post_votes WHERE user_id= ? AND post_id=?", [user.userid, this.data.id]);
    stmt1.get(function(err, row){
        if (err) console.log(JSON.stringify(err, 3));
        if (row == null) {
            self.setMyvote( 0 );
            checkDone();
            return;
        }
        //console.log(row);
        if (row.vote != null) {
            self.setMyvote( row.vote );
        } else {
            self.setMyvote( 0 );
        }
        checkDone();
    });
    
    var stmt2 = db.prepare("SELECT count(id) AS numreplies FROM post_replies WHERE reply_to= ?", row.id);
    stmt2.get(function(err, row){
        if (err) console.log(JSON.stringify(err, 3));
        //console.log(row);
        if (row == null) {
            self.setNumReplies( 0 );
            
        } else if (row.numreplies != null) {
            //console.log("setting replies to "+row.numreplies);
            self.setNumReplies( row.numreplies );
        } else {
            self.setNumReplies( 0 );
        }
        checkDone();
    });
    
}
// class methods
Post.prototype.setMyvote = function(vote) {
    this.data.myvote = vote;
};
Post.prototype.setNumReplies = function(num) {
    this.data.numreplies = num;
};
Post.prototype.addReplies = function(user, callback) {
    var self = this;
    
    var stmt2 = db.prepare("SELECT post_replies.id, post_replies.time, body, username, sum(vote) AS score FROM post_replies JOIN users ON (posted_by = users.id) JOIN reply_votes ON (post_replies.id = reply_id) WHERE reply_to = ? GROUP BY post_replies.id ORDER BY post_replies.id", this.data.id);
    stmt2.all(function(err, rows) {
        if (rows == null) {
            callback();
        } else {
            var numReplies = rows.length;
            var numDoneReplies = 0;

            if (numReplies == 0) {
                callback();
            }
            self.replies = [];
            for (i = 0; i < rows.length; i++) { 
               self.replies[i] = new Reply(rows[i], user, function() {
                    numDoneReplies++;
                    if (numReplies == numDoneReplies) {
                      callback();
                    } 
                });

            }
        }
    });
};
//// class methods
//Post.prototype.setScore = function(score) {
//    this.score = score;
//};
// export the class
module.exports = Post;

