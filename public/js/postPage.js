$( window ).load(function() {
    console.log(post);
    console.log(replies);
    
    var postContainer = $("#bigPostContainer");
    var replyContainer = $("#replyContainer");
    
    var mainPost = createPost(post.data, postContainer);
    postContainer.find(".post-panel").addClass("big-post");
    
    for (var i = 0; i < replies.length; i++) {
        createReply(replies[i].data, replyContainer);
    }
    
});