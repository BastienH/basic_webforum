var sqlite3 = require('sqlite3').verbose();
var db = global.db;

/*
 * Constructor call with data from the db row
 * If the getReplies is set to true then the constructor will also fetch an array
 * of replies, if false then it will just fetch the number
 * 
 * The constructor will call the callback when all database queries have finished
 */
function Reply(row, user, callback) {
  
    this.data = row;
    this.data.myvote = 0;
    this.data.time = this.data.time + "+00:00"; // Fix for timestamps in UTC
    
    if (this.data.username === user.username)
        this.data.editable = true;
    else
        this.data.editable = false;
    
    var self = this;
  
    var NUM_ASYNC_CALLS = 1;    // number of async calls done in this constructor
    var asyncCallsDone = 0;     // each async call increments this when done
    
    function checkDone() {      // called after each async call, executes the call back when the last one finishes
        asyncCallsDone++;
        if (asyncCallsDone >= NUM_ASYNC_CALLS) {
            //console.log("Finished constructor for "+JSON.stringify(self, 3));
            callback();
        }
    }
    
    var stmt1 = db.prepare("SELECT vote FROM reply_votes WHERE user_id= ? AND reply_id=?", [user.userid, this.data.id]);
    stmt1.get(function(err, row){
        if (err) console.log(JSON.stringify(err, 3));
        //console.log(row);
        if (row && row.vote != null) {
            self.setMyvote( row.vote );
        } else {
            self.setMyvote( 0 );
        }
        checkDone();
    });
    
    
}
// class methods
Reply.prototype.setMyvote = function(vote) {
    this.data.myvote = vote;
};
//// class methods
//Post.prototype.setScore = function(score) {
//    this.score = score;
//};
// export the class
module.exports = Reply;

