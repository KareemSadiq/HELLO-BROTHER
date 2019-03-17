
const socket = io();

// $('#chat-list').hide();
// $('#div-chat').hide();
// $('#reg-form').hide();
// $('#signin').hide();
// $('#signup').show();
//  $('#acwindow').hide();
//  $('.dropdown').hide();


function ids() {
	$('#chat-list').hide();
	$('#div-chat').hide();
	$('#reg-form').hide();
	$('#signin').hide();
 	$('#signup').hide();
 	$('#Home').hide();
 	$('#acwindow').hide();
 	$('.dropdown').hide();
}



function start() {
	ids();
	checkCookie();
}

function cookiey() {
	ids();
	$('#Home').show();
	$('.dropdown').show();

}

function cookien() {
	ids();
	$('#signin').show();
}

function reg_fm() {
	ids();
	$('#reg-form').show();
}

function ac() {
	ids();
	$('.dropdown').show();
	$('#acwindow').show();
}

function ln() {
	// home = true;
	ids();
	$('.dropdown').show();
	$('#Home').show();
}

function lng() {
	ids();
	$('#signin').show();
	$('#g-auth').hide();

}

function lg() {
	ids();
	$('#signin').show();
}

function cr() {
	ids();
	$('.dropdown').show();
	$('#div-chat').show();
	$('#chat-list').show();
}

// GLOBAL Variables

var v_s = 0; // if 1 then video sharing if 2 then screen sharing
var gname=[]; //google signedin user details
var n = []; // Data obtained from server after login(direct || via cookie)
var tn = []; // token obtained from server after login for session creation
var home = false; //  true to display home page
var k = ''; // unused variable
var u_name = false; // to append username to the label of account page
var reg = false; // unused  boolean variable
var hc = false; //to enable logo click(redirect to home page)
var oncall = []; //stores peerid of person whom we are communicating to
var btn = false; //if user want to disconnect call



//COOKIES !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


//TO SET A COOKIE WITH TIME INTERVAL PROVIDED//
function setCookie(cname,token,t) {
	var d = new Date();
	d.setTime(d.getTime() + (t*24*60*60*1000));
	var expires = "expires=" + d.toGMTString();
	document.cookie = cname + "=" + token + ";" + expires + ";path=/";
	console.log(document.cookie);
}

//TO GET A COOKIE //

function getCookie(cname) {
	  var name = cname + "=";
	  var decodedCookie = decodeURIComponent(document.cookie);
	  var ca = decodedCookie.split(';');
	  for(var i = 0; i < ca.length; i++) {
	    var c = ca[i];
	    while (c.charAt(0) == ' ') {
	      c = c.substring(1);
	    }
	    if (c.indexOf(name) == 0) {
	      return c.substring(name.length, c.length);

	    }
	  }
	  return "";

}

//TO CHECK COOKIE IF ALREADY PRESENT IF PRESENT GET THE TOKEN VALUE IN VARIABLE "u"  //

function checkCookie() {
	var u = getCookie("username");
	console.log(u);

	$.ajax({
				url:'/tkn',
				method: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({t : u }),
				success: function (res) {
					home = true;
					console.log(res.name);
					n.push(res.name);
					tn.push(res.token);
					$('#a_user').append(n[0]);
					u_name = true;

				}

			});





	if(u!= "") {
		alert("Welcome again" + u);
		 cookiey();

	} else {
		 cookien();
		// $('#signin').show();
	}
}


// GOOGLE SIGNED IN USER DATA//

function onSignIn(googleUser) {

        var profile = googleUser.getBasicProfile();
        console.log(profile);
        var name = profile.getName();
        gname.push(name);
        gname.push(profile.getEmail());
        gname.push(profile.getImageUrl());
        gname.push(profile.getId());
        console.log(gname);
        console.log(gname[3]);
        console.log(gname);
        if(gcheck(gname[0],gname[1]) != true){
            	reg_fm();
           }
    }


function gcheck(name,email) {
	var l_name = name;
	var l_email = email;
	$.ajax({
				url:'/users',
				method: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({name : l_name , email : l_email , l : true}),
				success: function (res) {
					//if the user have an account on the email specified then login page with no google button lng()
					lng();
					return true;				

				}

			});
}


// REGISTERING NEW USER AFTER GOOGLE AUTHENTICATION //

function getData() {

	var username = $('#uname').val();
	var pass = $('#pass').val();
	var cpass = $('#cpass').val();
	console.log(username);
	if(pass!=cpass){
		alert('password mismatch');
	}
	else {
		$.ajax({
			url:'/users',
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({name : username , password : pass  , gname : gname[0] , email:gname[1] , image:gname[2] , gid:gname[3]}),

			success: function (res) {
				alert("Successfully signed up");
				lng();
				}

				
				});

			
		}
}














//LOGIN THE USER //

function login(ton) {

	var resp;

	if(ton === '0'){

	var l_name = $('#l_name').val();
	var l_pass = $('#l_pass').val();

	$.ajax({
				url:'/users',
				method: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({name : l_name , password : l_pass , k : true}),
				success: function (res) {
					n.push(res.name,res.dat[0].email);
					setCookie("username",res.token,0.1);
					sethome();
				}
		});
	}

	else {

		$.ajax({
				url: '/tkn',
				method: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({t:ton}),
				success: function (res) {
					n.push(res.name,res.dat[0].email);
					sethome();
				}
		});
	}

	

}


// SETTING UP THE PAGE CLICK EVENTS AFTER LOGIN //

function sethome() {
	ids();
	$('#Home').show(); // display home
	$('#a_user').append(' ' + n[0]); // append name to account page
	home = true; //enable logo event ( redirect to home page)
	$('.dropdown').show(true);
	$('#nm').append(' ' , n[0].toUpperCase());

}


$('#account').click(() => {
		
		ac();	
		
});



$('#home_m').click(() => {
	if (home == true) {
		ln();
		
	}
});


$('#logout').click(() => {
	setCookie("username" , "" ,-1);
	alert("Cookie Successfully deleted");
	start();


});
























socket.on('UsersConnected' , arrUserInfo => {
	
	
	arrUserInfo.forEach(user => {
		const { name , peerId } = user;
		$('#ulUser').append(`<li  style="font-family: 'Playball', cursive; margin-left: 11%; font-size: 210%; margin-bottom: 5%; border-radius: 10px ;background-color:green; height: 50%; width: 78%;font-style: italic; color: white;" id="${peerId}">${name}</li>`);
	});


	socket.on('UpdatedUserInfo' , user => {
		const { name , peerId } = user;
		$('#ulUser').append(`<li style="font-family: 'Playball', cursive; margin-left: 11%; font-size: 210%; margin-bottom: 5%; border-radius: 10px ;background-color:green; height: 50%; width: 78%;font-style: italic; color: white;" id="${peerId}">${name}</li>`);
	});

	socket.on('UserDisconnected' , peerId => {
		$(`#${peerId}`).remove();
	});

	


});

socket.on('Repetation', () => alert('Username Already Exists'));

if(btn == true) {
	$('#endcall').show();
}






function openStream() {

	if(v_s == 1) {
	var config = {audio:true , video:true};
	return navigator.mediaDevices.getUserMedia(config);
	}
	if(v_s == 2) {
	var config = {video:true};
	return navigator.mediaDevices.getDisplayMedia(config);

	}
}



function playStream(idVideoTag , stream) {
	const video = document.getElementById(idVideoTag);
	video.srcObject = stream;
	video.play();
}





// $('#a_user').append(n[0]);

// var name = null;
// var token = null;





// function p_append () {
// 	if (u_name == false) {
// 		$('#a_user').append(n[0]);
// 	}	
// }














const peer = new Peer({key: 'lwjd5qra8257b9'});

peer.on('open' , id => {
	 $('#my-peer').append(id);
	 
	 $('#btnSignUp').click(() => {
	 	const username = $('#txtUsername').val();
	 	socket.emit('UserCredentials' , {name: username,peerId: id});

	 });


	 $('#croom').click(()=>{
	 	v_s = 1;
	 	socket.emit('UserCredentials',{name:n[0],peerId:id });
	 	btn = true;
	 	cr();

	 });

	 $('#scroom').click(() => {
	 	v_s = 2;
	 	socket.emit('UserCredentials',{name:n[0],peerId:id });
	 	btn = true;
	 	cr();

	 });


	 $('#endcall').click(() => {
		socket.emit('EndCall' , oncall[0]);
		peer.destroy();
		ln();
	});


	


});

 
$('#btnCall').click(() => {
	const id = $('#remoteId').val();
	openStream()
	.then(stream => {
		playStream('localStream',stream);
		const call = peer.call(id,stream);
		call.on('stream',remoteStream => playStream('remoteStream',remoteStream));
	});
});



peer.on('call' , call => {
	openStream()
	.then(stream => {
		call.answer(stream);
		playStream('localStream',stream);
		call.on('stream',remoteStream => playStream('remoteStream' , remoteStream));

	});
});

$('#ulUser').on('click' , 'li' , function() { 
	const id = $(this).attr('id');
	oncall.push(id);
	openStream()
	.then(stream => {
		playStream('localStream',stream);
		const call = peer.call(id,stream);
		call.on('stream',remoteStream => playStream('remoteStream',remoteStream));
	});
});
