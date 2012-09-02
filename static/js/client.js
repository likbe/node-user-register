  var socket = io.connect('http://localhost:8888');
  socket.on('news', function (data) {
  	console.log(data.hello);
  });

  socket.on('messageBroadcast', function(data) {
  	$('#messageHistory').append('<p>'+data.message+'</p>');
  });

  function sendMessage() {
  	message = $('#messageContent').val();
  	$('#messageHistory').append('<p>'+message+'</p>');
  	socket.emit('send a message', { message : message});
  }