var socket = io();
socket.on('connect', function () {
	console.log("Connected to SERVER");
});

socket.on('message', function (message){
	console.log(message.text);
})