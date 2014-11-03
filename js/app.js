var App = Ember.Application.create();

App.Router.map(function() {
	this.route('game');
});

App.ChatMessagesController = Ember.ArrayController.create();

var socket = io.connect('http://'+window.location.hostname+':80');

function Britannia(nickname) {
	socket.on('connect',function(data){
		socket.emit('join',nickname);
	});
	socket.on('messages',function(data){
		App.ChatMessagesController.unshiftObject(data);
	});
}

$(function(){
	var bt = new Britannia( 'foo' );

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