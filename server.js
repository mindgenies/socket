const PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
var now = moment();

var clientInfo = {};

function getRoomUsers(socket)
{
	var info = clientInfo[socket.id];
	if(typeof info == 'undefined')
	{
		return;
	}

	var users = [];

	Object.keys(clientInfo).forEach( function (socketId) {
		var userInfo = clientInfo[socketId];
		if(info.room == userInfo.room)
		{
			users.push(userInfo.name);
		}
	});

	var message = {};
	message.name = "System";
	message.text = "Users: " + users.join(', ');
	message.timeStamp = now.valueOf();
	socket.emit('message',message);
}

io.on('connection', function (socket)
{
	console.log("user connected");

	socket.on('disconnect', function () {
		var userData = clientInfo[socket.id];
		if(typeof userData != 'undefined')
		{
			socket.leave(userData.room);
			message = {};
			message.timeStamp = now.valueOf();
			message.name = "System";
			message.text = userData.name + " has left the room!";
			socket.broadcast.to(userData.room).emit('message',message);
			delete clientInfo[socket.id];
		}		
	});

	socket.on('joinRoom', function (req) {
		socket.join(req.room);
		clientInfo[socket.id] = req;
		message = {};
		message.timeStamp = now.valueOf();
		message.name = "System";
		message.text = req.name + " has joined the room!";
		socket.broadcast.to(req.room).emit('message',message);
	});

	socket.on('message', function (message) {
		//socket.broadcast.emit('message',message);

		if(message.text == '@users')
		{
			getRoomUsers(socket);
		}
		else
		{
			message.timeStamp = now.valueOf();
			io.to(clientInfo[socket.id].room).emit('message',message);
		}
		
	});

	socket.emit('message', {
		text: "Welcome to chat system!",
		timeStamp: now.valueOf(),
		name: "System"
	});
});

app.use(express.static(__dirname + "/public_html"));
http.listen(PORT, function () {
	console.log("listing " + PORT);
});