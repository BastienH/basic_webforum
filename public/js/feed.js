var postContainer;

$( window ).load(function() {
    //$("body").on("click", handleBodyClick);
   
    postContainer = $("#postContainer");
//    $(window).keydown(function(event){
//        if(event.keyCode == 13) {
//            event.preventDefault();
//            searchSongs();
//            return false;
//        }
//    });
    getPosts();
    $("time.timeago").timeago();
});

//function editSong(song) {
//    editSongInputs.title.val(song.title);
//    editSongInputs.bookCode.val(song.bookcode);
//    editSongInputs.page.val(song.page);
//    editSongInputs.key.val(song.id);
//    
//    $("#songEditModal").modal("show");
//}
//
//function saveSong() {
//    var songData = {
//        title: editSongInputs.title.val(),
//        bookCode: editSongInputs.bookCode.val(),
//        page: editSongInputs.page.val()
//    }
//    $.post("api/song/update/"+editSongInputs.key.val(), songData, function(data, status) {
//        console.log(data);
//        var resp = JSON.parse(data);
//        if (resp.success == true) {
//            $("#songEditModal").modal("hide");
//            getAllSongs();
//        } else {
//            console.log("error saving song");
//        }
//    });
//}
//
//function deleteSongModal(song) {
//    $("#confirmDeleteModal").find(".prompt").text(song.id + ' "' + song.title + '" book: ' + song.bookcode);
//    $("#confirmDeleteModal").find("#confirmDeleteBtn").on("click", function() {
//        $.getJSON("api/song/delete/"+song.id, {}, function(data, status) {
//            console.log(data);
//            //var resp = JSON.parse(data);
//            if (data.success == true) {
//                $("#confirmDeleteModal").modal("hide");
//                getAllSongs();
//            } else {
//                console.log("error deleting song");
//            }
//        });
//    });
//    $("#confirmDeleteModal").modal("show");
//    
//}


/*
 * Getting data from the server
 */
function getPosts() {
    console.log("getting posts");
    //$(".songLoadingIcon").show();
    //songTableBody.html("");
    $.getJSON("api/post/get/feed", {}, function(data, status) {
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            createPost(data[i].data, postContainer);
        }
        //hide loading icon
        //$(".songLoadingIcon").hide();
    });
}


function addAlert(text, alertClass, appendTo) {
    $(".alert").hide();
    var alert="";
        alert += "<div class=\"alert alert-dismissible "+ alertClass +"\">";
        alert += "  <button type=\"button\" class=\"close\" data-dismiss=\"alert\">×<\/button>";
        alert += "  <h4><span><\/span><\/h4>";
        alert += "<\/div>";
        
    appendTo.prepend(alert);
    appendTo.find(".alert").find("span").text(text);
    //elem.text(text);
}


$(function(){
    $(".increment").click(function(){
        var count = parseInt($("~ .count", this).text());

        if($(this).hasClass("up")) {
            var count = count + 1;

            $("~ .count", this).text(count);
        } else {
            var count = count - 1;
            $("~ .count", this).text(count);     
        }

        $(this).parent().addClass("bump");

        setTimeout(function(){
            $(this).parent().removeClass("bump");    
        }, 400);
    });
});
