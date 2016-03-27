/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$( window ).load(function() {
    console.log(posts);
    
    var postContainer = $("#postContainer");
    
    for (var i = 0; i < posts.length; i++) {
        createPost(posts[i].data, postContainer);
    }
    
});
