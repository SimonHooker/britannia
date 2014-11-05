var App = Ember.Application.create();
var socket = io.connect('http://'+window.location.hostname+':80');

App.Router.map(function() {
	this.resource('game');
});

App.Chat = [];

App.Game = {
	chat: App.Chat
};

App.User = {
	name: 'afsfas'
};

App.ApplicationRoute = Ember.Route.extend({
	renderTemplate: function(controller,model) {
		this._super();
		this.render( App.User.name.length > 0 ? 'signin-welcome' : 'signin-form' , {
			into: 'application',
			outlet: 'signin'
		});
	}
});


App.GameRoute = Ember.Route.extend({
	model: function() {
		return App.Game;
	}
});

socket.on('connect',function(data){
});

socket.on('messages',function(data){
	App.Game.chat.unshiftObject(data);
});

socket.on('signedin',function(data){
	App.User.name = data.nickname;
});

$(function(){

	$('body')
		.on('submit','form.simple-form',function(e){
			e.preventDefault();
			var form = $(this);
			var action = form.data('action') || '';
			if (
				action.length > 0
			) {
				var input = form.find('input');
				var message = input.val();
				if (message.length > 0) {
					input.val('');
					socket.emit( action , message );
				}
			}
		})
		.on('click','form.simple-form button',function(e){
			e.preventDefault();
			$(this).closest('form').trigger('submit');
		});
		

});