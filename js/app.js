var App = Ember.Application.create();

App.Router.map(function() {
	this.route('game');
});

App.ChatMessagesController = Ember.ArrayController.create();

function Britannia(server,nickname) {
	var game = this;

	this.socket = io.connect('http://'+server+':80');

	this.socket.on('connect',function(data){
		game.socket.emit('join',nickname);
	});

	this.socket.on('messages',function(data){
		App.ChatMessagesController.unshiftObject(data);
	});

	$('div.chat-frame')
		.on('click','form button',function(e){
			e.preventDefault();
			$(this).closest('form').trigger('submit');
		})
		.on('submit','form',function(e){
			e.preventDefault();
			var self = $(this).find('input');
			var message = self.val();
			if (message.length > 0) {
				self.val('');
				game.socket.emit( 'messages' , message );
			}
		});

}

var bt = undefined;

$(function(){
	bt = new Britannia( window.location.hostname , 'foo' );
});