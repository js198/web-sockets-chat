//make connection
//socket not the same var as in index.js, its for the frontend!
//io available through cloud server library
var socket = io.connect('http://localhost:3000');

//query DOM
var messager = document.querySelector('.messager'),
	message = document.getElementById('message'),
	handle = document.getElementById('handle'),
	sendMsg = document.getElementById('send'),
	output = document.getElementById('output'),
	feedback = document.getElementById('feedback'),
	users = document.querySelector('.users'),
	loginformarea = document.querySelector('.loginFormArea'),
	login = document.getElementById('submit'),
	error = document.getElementById('error'),
	username = document.getElementById('username');

//emit(send out from a source) events

login.addEventListener('click', function(e){
	e.preventDefault();
	//emit send info from user to the server
	socket.emit('new user', username.value, function(data){
		if(data){
			loginformarea.classList.add('disappear');
			messager.classList.add('show');
			users.innerHTML += '<li><h3>' + data.handle + '</h3></li>';
		}else{
			error.innerHTML = 'Username is already taken.';
		}
	});
	username.value = '';
});

sendMsg.addEventListener('click', function(e){
	e.preventDefault();
	//emit send info from user to the server in index.js
	socket.emit('chat', {
			message: message.value,
			handle: handle.value
		});
	message.value = '';
});

socket.on('new message', function(data){
	feedback.innerHTML = '';
	message.innerHTML = '';
	output.innerHTML += '<p><strong>' + data.handle + ':</strong> ' + data.message + '</p>';
});

message.addEventListener('keypress', function(){
	socket.emit('typing', handle.value);
});

//listen for events

socket.on('typing', function(data){
	feedback.innerHTML = '<p><em>' + data + ' is typing a message' + '</em></p>';
});

socket.on('get users', function(data){
	var html = '';
	for(var i = 0; i < data.length; i++){
		html += '<li>' + data[i] + '</li>';
	}
	users.innerHTML = html;
});