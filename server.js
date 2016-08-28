const PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function (socket)
{
	console.log("user connected");

	socket.on('message', function (message) {
		socket.broadcast.emit('message',message);
	});

	socket.emit('message', {
		text: "Hi Client"
	});
});

app.use(express.static(__dirname + "/public_html"));
http.listen(PORT, function () {
	console.log("listing " + PORT);
});