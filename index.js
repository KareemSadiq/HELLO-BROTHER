// const io = require('socket.io')(process.env.PORT || 3000);

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const SHA256 = require("crypto-js/sha256");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/users');


server.listen(3000 || process.env.port);

mongoose.connect('mongodb://localhost/usersdatas' , { useNewUrlParser: true });


// mongoose.connect('mongodb+srv://gostream:goStream@cluster0-lzt0z.mongodb.net/gostream' , { useNewUrlParser: true });
mongoose.Promise = global.Promise;

app.use(express.static(__dirname));

app.use(bodyParser.json());



app.get('/' , (req,res) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/users' , (req,res) => {
	var k = req.body;
	console.log(k);
});


var usersOnline = [];








app.post('/users' , (req,res) => {

	if(req.body.k == true) {

		console.log(req.body);
		var u = User.find({ name: req.body.name , password:SHA256(req.body.password + SHA256('1321212')).toString()}).then(resp => {
			console.log(resp);
			var time = Date().toString();
			console.log(time);
			console.log(SHA256(time + SHA256(req.body.name) + SHA256('547565')).toString());
			var z = SHA256(time + SHA256(req.body.name) + SHA256('547565')).toString();
			var data = { token:z , name: req.body.name , dat:resp};
			res.send(data);

			usersOnline.push(data);
			res.send(data);
			
		});
	}

	if(req.body.l == true) {

		console.log(req.body);
		var u = User.find({ name: req.body.name , email:req.body.email}).then(resp => {
			console.log(resp);
			var time = Date().toString();
			console.log(time);
			console.log(SHA256(time + SHA256(req.body.name) + SHA256('547565')).toString());
			var z = SHA256(time + SHA256(req.body.name) + SHA256('547565')).toString();
			var data = { token:z , name: req.body.name};

			usersOnline.push(data);
			res.send(data);
			
		});
	}



	
	else {
		npass = SHA256(req.body.password + SHA256('1321212')).toString();

		k = {name:req.body.name , password:npass , email:req.body.email , gname:req.body.gname , gid:req.body.gid , imgUrl:req.body.image};
		console.log(k);

		console.log(req.body);

		var email = req.body.email;

				User.create(k).then(function(user) {
				res.send(user);	
				console.log(user);
	
			});
	
		}
});


app.post('/tkn' , (req,res) => {

		var dat = req.body.t;

		for(i=0;i<usersOnline.length;i++){
			if(usersOnline[i].token === dat){
				console.log(usersOnline[i]);
				res.send(usersOnline[i]);
				break;
			}
		}


});






const arrUserInfo = [];



io.on('connection' , socket => {
	socket.on('UserCredentials' , user => {
		console.log(user);
		// const isExist = arrUserInfo.some(e => e.name == user.name)
		socket.peerId = user.peerId;
		// if (isExist) return socket.emit('Repetation');
		arrUserInfo.push(user);
		socket.emit('UsersConnected' , arrUserInfo);
		socket.broadcast.emit('UpdatedUserInfo' , user);
	});

	socket.on('EndCall' , pid => {
		const idx = arrUserInfo.findIndex(user => user.peerId === pid);
		arrUserInfo.splice(idx , 1);
		io.emit('UserDisconnected' , pid);

	});

	socket.on('disconnect' , () => {
		const index = arrUserInfo.findIndex(user => user.peerId === socket.peerId);
		arrUserInfo.splice(index , 1);
		io.emit('UserDisconnected' , socket.peerId);
	});
});