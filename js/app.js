App = Ember.Application.create();

App.Router.map(function() {
	this.route('game');
});

App.ChatMessagesController = Ember.ArrayController.create();


$(function(){
	// use the socket.io server to connect to localhost:8080 here
	var socket = io.connect('http://'+window.location.hostname+':80');

	var insertMessage = function(data) {
		App.ChatMessagesController.unshiftObject(data);
	};

	socket.on('connect',function(data){
		$('#status').html('Connected to Britannia');
		/*
		nickname = prompt('Who are you?');
		*/
		socket.emit('join','Foo');
	});

	socket.on('messages',insertMessage);

	$('div.chat-frame').on('click','form button',function(e){
		e.preventDefault();
		$(this).closest('form').trigger('submit');
	}).on('submit','form',function(e){
		e.preventDefault();
		var self = $(this).find('input');
		var message = self.val();
		if (message.length > 0) {
			self.val('');
			socket.emit( 'messages' , message );
		}
	});

});