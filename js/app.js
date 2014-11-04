var App = Ember.Application.create();
var socket = io.connect('http://'+window.location.hostname+':80');

App.Router.map(function() {
	this.resource('game');
});

App.Chat = [];

App.Game = {
	chat: App.Chat
};

App.GameRoute = Ember.Route.extend({
	model: function() {
		return App.Game;
	}
});

socket.on('connect',function(data){
	socket.emit('join','foo');
});

socket.on('messages',function(data){
	App.Game.chat.unshiftObject(data);
});

$(function(){


	$('body')
		.on('click','form.chat-form button',function(e){
			e.preventDefault();
			$(this).closest('form').trigger('submit');
		})
		.on('submit','form.chat-form',function(e){
			e.preventDefault();
			var self = $(this).find('input');
			var message = self.val();
			if (message.length > 0) {
				self.val('');
				socket.emit( 'messages' , message );
			}
		});

});