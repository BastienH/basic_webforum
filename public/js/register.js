/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function changePasswordProgressBar(ev) {
    // less than 8 characters
    var worst = 7,
        // minimum 8 characters
        bad = /(?=.{8,}).*/,
        //Alpha Numeric plus minimum 8
        good = /^(?=\S*?[a-z])(?=\S*?[0-9])\S{8,}$/,
        //Must contain at least one upper case letter, one lower case letter and (one number OR one special char).
        better = /^(?=\S*?[A-Z])(?=\S*?[a-z])((?=\S*?[0-9])|(?=\S*?[^\w\*]))\S{8,}$/,
        //Must contain at least one upper case letter, one lower case letter and (one number AND one special char).
        best = /^(?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9])(?=\S*?[^\w\*])\S{8,}$/,
        password = $(ev.target).val(),
        strength = '0',
        progressClass = 'progress-bar progress-bar-',
        ariaMsg = '0% Complete (danger)',
        $progressBarElement = $('#password-progress-bar');

    if (best.test(password) === true) {
        strength = '100%';
        progressClass += 'success';
        ariaMsg = '100% Complete (success)';
    } else if (better.test(password) === true) {
        strength = '80%';
        progressClass += 'info';
        ariaMsg = '80% Complete (info)';
    } else if (good.test(password) === true) {
        strength = '50%';
        progressClass += 'warning';
        ariaMsg = '50% Complete (warning)';
    } else if (bad.test(password) === true) {
        strength = '30%';
        progressClass += 'warning';
        ariaMsg = '30% Complete (warning)';
    } else if (password.length >= 1 && password.length <= worst) {
        strength = '10%';
        progressClass += 'danger';
        ariaMsg = '10% Complete (danger)';
    } else if (password.length < 1) {
        strength = '0';
        progressClass += 'danger';
        ariaMsg = '0% Complete (danger)';
    }

    $progressBarElement.removeClass().addClass(progressClass);
    $progressBarElement.attr('aria-valuenow', strength);
    $progressBarElement.css('width', strength);
    $progressBarElement.find('span.sr-only').text(ariaMsg);

    if (strength >= "50%" || strength == "100%") {
        $("#bl_inputPassword_form-group").removeClass("has-error");
    } else {
        $("#bl_inputPassword_form-group").addClass("has-error");
    }
} 
function validatePasswordVerify(ev) {
    var password = $("#inputPassword").val();
    var passwordValidate = $("#inputPasswordVerify").val();
    console.log(password + " <-> " + passwordValidate);
    if (password === passwordValidate && password !== "") {
        $("#bl_inputPasswordVerify_form-group").removeClass("has-error");
    } else {
        $("#bl_inputPasswordVerify_form-group").addClass("has-error");
    }
}
function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

function validateEmailInput(ev) {

}

var lastUsername = "";

function validateUsername(ev) {
    var username = $("#inputUsername").val();
    //global lastUsername to only check if available on a change
    if (username !== lastUsername) {
        lastUsername = username;
        $.post("/api/user/username-free", {username: username}, function(data, status) {
           console.log(data);
            responseObj = JSON.parse(data);

            if (responseObj.isFree == true) {
                $("#bl_userInfo").html(username + " is available");
                $("#bl_userInfo").removeClass("label-danger");
                $("#bl_userInfo").addClass("label-primary");
                $("#bl_inputUsername_form-group").removeClass("has-error");
            } else if (responseObj.isFree == false) {
                //console.log("false");
                $("#bl_userInfo").html(username + " is unavailable");
                $("#bl_userInfo").removeClass("label-primary");
                $("#bl_userInfo").addClass("label-danger");
                $("#bl_inputUsername_form-group").addClass("has-error");
            }

            //$("#bl_userInfo").text(data.labelText);
        });
    }

}

function validateEmailVerify(ev) {
    email = $("#inputEmail").val();
    emailValidate = $("#inputEmailVerify").val();
    if (email === emailValidate && email !== "") {
        $("#bl_inputEmailVerify_form-group").removeClass("has-error");
    } else {
        $("#bl_inputEmailVerify_form-group").addClass("has-error");
    }
}

$(document).ready(function () {
    $(".pwd").first().on('keyup', changePasswordProgressBar);   //also handles validating password
    $("#bl_submit").prop('disabled', true);
    //$("#inputPasswordVerify").on('keyup', validatePasswordVerify);
    //$("#inputEmailVerify").on('keyup', validateEmailVerify);

    $(document).keyup(function (event) {
        validatePasswordVerify();
        validateEmailVerify();
        validateUsername();
        //changePasswordProgressBar();

        if ($(".has-error")[0]){
            //$("#bl_submit").addClass("disabled");
            $("#bl_submit").prop('disabled', true);
            $("#bl_submit").addClass("disabled");
        } else {
            $("#bl_submit").prop('disabled', false);
            $("#bl_submit").removeClass("disabled");
        }   
    });

});