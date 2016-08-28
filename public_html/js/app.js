var socket = io();
socket.on('connect', function () {
	console.log("Connected to SERVER");
});

socket.on('message', function (message){
	console.log(message.text);
	$(".chat").append("<p><b>" + moment.utc(message.timeStamp).local().format("h: mm a") + "</b> "+message.text+"</p>");
}); 


$(document).ready(function(){
    $('#sendit').click(function() {
	 var mytext = $("#mytext").val();	  
	  socket.emit('message',{text: mytext});
	  $("#mytext").val('');
	  $("#mytext").focus();
	});
});

