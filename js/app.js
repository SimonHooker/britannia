App = Ember.Application.create();

App.Router.map(function() {
  // put your routes here
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return ['red', 'yellow', 'blue'];
  }
});


$(function(){
	// use the socket.io server to connect to localhost:8080 here
	var socket = io.connect('http://'+window.location.hostname+':80');

	var insertMessage = function(data) {
		$('#chat_target').append($('<p>'+data+'<p>'));
	};

	socket.on('connect',function(data){
		$('#status').html('Connected to Britannia');
		nickname = prompt('Who are you?');
		socket.emit('join',nickname);
	});

	socket.on('messages',function(data){
		insertMessage(data);
	});

	$('#chat_form').submit(function(e){
		e.preventDefault();
		var message = $('#chat_input').val();
		$('#chat_input').val('');
		socket.emit( 'messages' , message );
	});

});