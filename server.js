const PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
var now = moment();

io.on('connection', function (socket)
{
	console.log("user connected");

	socket.on('message', function (message) {
		//socket.broadcast.emit('message',message);
		message.timeStamp = now.valueOf();
		io.emit('message',message);
	});

	socket.emit('message', {
		text: "Welcome to chat system!",
		timeStamp: now.valueOf()
	});
});

app.use(express.static(__dirname + "/public_html"));
http.listen(PORT, function () {
	console.log("listing " + PORT);
});