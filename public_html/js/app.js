var socket = io();
var name = getParameterByName('name') || "Guest";
var room = getParameterByName('room') || "No Room";

socket.on('connect', function () {
	console.log("Connected to SERVER");

	socket.emit('joinRoom', {
		name: name,
		room: room
	});
});

socket.on('message', function (message){
	console.log(message.text);
	$(".chat").append("<p><b>" + message.name + " " + moment.utc(message.timeStamp).local().format("h: mm a") + "</b></p>");
	$(".chat").append("<p>"+message.text+"</p>");
}); 


$(document).ready(function(){
	$("#roomid").html(room);
    $('#sendit').click(function() {
	 var mytext = $("#mytext").val();	  
	  socket.emit('message',{text: mytext, name: name});
	  $("#mytext").val('');
	  $("#mytext").focus();
	});
});

