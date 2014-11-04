var App = Ember.Application.create();

App.Router.map(function() {

	this.resource('games');

	this.resource('game',{ path: '/games/:id' });

});

App.GAMES = [];
App.GAMES.pushObject({
	id: '1',
	name: 'foo'
});
App.GAMES.pushObject({
	id: '2',
	name: 'bar'
});
App.GAMES.pushObject({
	id: '3',
	name: 'fubar'
});

App.CHATMESSAGES = [];

App.GamesRoute = Ember.Route.extend({
	model: function() {
		return App.GAMES;
	}
});

App.GameRoute = Ember.Route.extend({
	model: function(params) {
		return App.GAMES.findBy('id',params.id);
	}
});


var socket = io.connect('http://'+window.location.hostname+':80');

socket.on('connect',function(data){
	socket.emit('join','foo');
});

socket.on('messages',function(data){
	App.CHATMESSAGES.unshiftObject(data);
});



$(function(){


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
				socket.emit( 'messages' , message );
			}
		});

});