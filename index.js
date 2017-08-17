var express = require('express');
var socket = require('socket.io');
//app setup
var app = express();
var server = app.listen(3000, function(){
	console.log('websockets app started!');
});
var connections = [], users = [];

//static files
app.use(express.static('public'));

//socket setup so that it works on set up server-waiting for a client/browser connection
var io = socket(server);

//listening for a connection, pass info once info recieved
io.on('connection', function(socket){
	connections.push(socket);
	if(connections.length===1){
		console.log("made socket connection. %s socket connected", connections.length);
	} else {
		console.log("made socket connection. %s sockets connected", connections.length);
	}
	//disconnect
	socket.on('disconnect', function(data){
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
		console.log('disconnected: %s sockets connected', connections.length);
	});
	//this server recieves chat message from chat.js and sends the info down all sockets
	socket.on('chat', function(data){
		//grab all sockets available to me and emit data
		io.sockets.emit('new message', {message: data.message, handle: socket.username});
	});

	socket.on('typing', function(data){
		console.log(data);
		socket.broadcast.emit('typing', socket.username);
	});

	socket.on('new user', function(data, callback){
		if(users.indexOf(data) !== -1){
			callback(false);
		}else{
			callback(true);	
			socket.username = data;
			users.push(socket.username);
			updateUsernames();
		}
	});

	function updateUsernames(){
		io.sockets.emit('get users', users);
	}
});