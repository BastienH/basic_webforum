function createPost(postObj, appendTo) {
    var id = "post" + postObj.id;
    var post="";
    post += "<div class=\"row post\" id=\"" + id + "\">";
    //post += "            <div class=\"\">";
    post += "                <div class=\"vote roundrect\">";
    post += "                    <div class=\"increment up upvote\"><\/div>";
    post += "                    <div class=\"increment down downvote\"><\/div>";
    post += "                    <div class=\"count score\"><\/div>";
    post += "                <\/div>";
    //post += "            <\/div>";
    //post += "            <div class=\"\">";
    post += "                <div class=\"panel panel-primary post-panel\">";
    post += "                    <div class=\"panel-heading\">";
    post += "                       <a class=\"panel-title\"><\/a>";
    post += "                       <div class=\"delete\"></div>";
    post += "                    <\/div>";
    post += "                    <div class=\"panel-body\">";
    post += "                      Panel content";
    post += "                    <\/div>";
    post += "                    <div class=\"panel-footer\">";
    post += "                        <div class=\"row\">";
    post += "                           <div class=\"col-sm-7\">";
    post += "                               <div><span class=\"username\"></span><span>&nbsp;&nbsp;&nbsp;</span><a class=\"replies\" href=\"post/?postid="+ postObj.id + "\"><\/a><\/div>";
    post += "                               ";    
    post += "                           </div>";
    
    post += "                           <div class=\"date\"><time class=\"timeago\" datetime=\"" + postObj.time + "\"></time><\/div>";
    post += "                        <\/div>";
    post += "                    <\/div>";
    post += "                <\/div>";
    //post += "            <\/div>";
    post += "        <\/div> ";
    
    appendTo.append(post);
    var currPost = $("#"+id);
    
    currPost.find(".score").text(postObj.score);
    currPost.find(".panel-title").text(postObj.title);
    currPost.find(".panel-title").attr("href", "/post/"+postObj.id)
    currPost.find(".panel-body").text(postObj.body);
    currPost.find(".username").text(postObj.username);
    currPost.find(".replies").text(postObj.numreplies+" replies");
    currPost.find(".replies").attr("href", "/post/"+postObj.id)
    
    if (postObj.editable) {
        currPost.find(".delete").append("<a class=\"delete-btn btn btn-danger btn-xs\">Delete</a>");
        currPost.find(".delete-btn").click(function() {
            handleDeleteButton("post", postObj);
        });
    }
    
    if (postObj.myvote == 1) {
       currPost.find(".upvote").addClass('voted');
    } else if (postObj.myvote == -1) {
       currPost.find(".downvote").addClass('voted');
    }
    
    currPost.find(".upvote").click( function(e) {
        $(this).parent().addClass("bump");
        votePost(postObj.id, 1, currPost, postObj.score);
    });
    currPost.find(".downvote").click( function(e) {
        $(this).parent().addClass("bump");
        votePost(postObj.id, -1, currPost, postObj.score);
    });

    $("time.timeago").timeago();
    
    return currPost;
}

function createReply(replyObj, appendTo) {
    var id = "reply" + replyObj.id;
    var post="";
    post += "<div class=\"row post\" id=\"" + id + "\">";
    //post += "            <div class=\"\">";
    post += "                <div class=\"vote roundrect\">";
    post += "                    <div class=\"increment up upvote\"><\/div>";
    post += "                    <div class=\"increment down downvote\"><\/div>";
    post += "                    <div class=\"count score\"><\/div>";
    post += "                <\/div>";
    //post += "            <\/div>";
    //post += "            <div class=\"\">";
    post += "                <div class=\"panel panel-success post-panel\">";
    post += "                    <div class=\"panel-heading\">";
    //post += "                      <a class=\"panel-title\"><\/a>";
    post += "                       <div class=\"delete\"></div>";
    post += "                    <\/div>";
    post += "                    <div class=\"panel-body\">";
    post += "                      Panel content";
    post += "                    <\/div>";
    post += "                    <div class=\"panel-footer\">";
    post += "                        <div class=\"row\">";
    post += "                            <div class=\"username col-sm-1\"><\/div>";
    post += "                            <a class=\"replies col-sm-3\" href=\"post/?postid="+ replyObj.id + "\"><\/a>";    
    post += "                            ";
    post += "                            <div class=\"date\"><time class=\"timeago\" datetime=\"" + replyObj.time + "\"></time><\/div>";
    post += "                        <\/div>";
    post += "                    <\/div>";
    post += "                <\/div>";
    //post += "            <\/div>";
    post += "        <\/div> ";
    
    appendTo.append(post);
    var currPost = $("#"+id);
    
    currPost.find(".score").text(replyObj.score);
    currPost.find(".panel-title").text(replyObj.title);
    //currPost.find(".panel-title").attr("href", "post/"+replyObj.id)
    currPost.find(".panel-body").text(replyObj.body);
    currPost.find(".username").text(replyObj.username);
    //currPost.find(".replies").text(replyObj.numReplies+" replies");
    
    if (replyObj.editable) {
        currPost.find(".delete").append("<a class=\"delete-btn btn btn-danger btn-xs\">Delete</a>");
        currPost.find(".delete-btn").click(function() {
            handleDeleteButton("reply", replyObj);
        });
    }
    
    if (replyObj.myvote == 1) {
       currPost.find(".upvote").addClass('voted');
    } else if (replyObj.myvote == -1) {
       currPost.find(".downvote").addClass('voted');
    }
    
    currPost.find(".upvote").click( function(e) {
        $(this).parent().addClass("bump");
        voteReply(replyObj.id, 1, currPost, replyObj.score);
    });
    currPost.find(".downvote").click( function(e) {
        $(this).parent().addClass("bump");
        voteReply(replyObj.id, -1, currPost, replyObj.score);
    });

    $("time.timeago").timeago();
    
    return currPost;
}

function votePost(ID, vote, postHtml, score) {
    //console.log("This is where the upvote request would be sent for comment " + ID);
    $.post("/api/post/vote", {vote: vote, postid: ID}, function(data, status) {
        postHtml.find('.vote').removeClass("bump"); 
        //console.log(data);
        var responseObj = JSON.parse(data);
        console.log(responseObj);
        if (responseObj.success == true){
            postHtml.find('.score').text(score+vote);
            if (vote == 1) {
                postHtml.find('.upvote').addClass('voted');
                postHtml.find('.downvote').removeClass('voted');
            } else {
                postHtml.find('.downvote').addClass('voted');
                postHtml.find('.upvote').removeClass('voted');
            }
        }
    });
}

function voteReply(ID, vote, replyHtml, score) {
    //console.log("This is where the upvote request would be sent for comment " + ID);
    $.post("/api/reply/vote", {vote: vote, replyid: ID}, function(data, status) {
        replyHtml.find('.vote').removeClass("bump"); 
        //console.log(data);
        var responseObj = JSON.parse(data);
        //console.log(responseObj);
        if (responseObj.success == true){
            replyHtml.find('.postScore').text(score+vote);
            if (vote == 1) {
                replyHtml.find('.upvote').addClass('voted');
                replyHtml.find('.downvote').removeClass('voted');
            } else {
                replyHtml.find('.downvote').addClass('voted');
                replyHtml.find('.upvote').removeClass('voted');
            }
        }
    });
}

function handleDeleteButton(postOrReply, data) {
    if (postOrReply == "post") {
        var promptText = "You are about to delete post: \""+data.title+"\"";
        $(".deletePrompt").text(promptText);
        $("#deleteForm").attr({action: "/post/"+data.id+"/delete"});
        $("#confirmDeleteModal").modal("show");
    } else if (postOrReply == "reply") {
        var promptText = "You are about to delete reply: \""+data.body+"\"";
        $(".deletePrompt").text(promptText);
        $("#deleteForm").attr({action: "/reply/"+data.id+"/delete"});
        $("#confirmDeleteModal").modal("show");
    }
    
}



