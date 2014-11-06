var App = Ember.Application.create();
var socket = io.connect('http://'+window.location.hostname+':80');

App.Router.map(function() {
	this.resource('game',{ path: '/' });
});

App.CHAT = [];

App.REGIONS = [
	{
		id: 'region1',
		name: {
			text: 'Region One',
			x: 110,
			y: 110
		},
		area: {
			path: 'M100,100L200,100L200,200L100,200Z',
			fill: '#AAAA00'
		}
	},
	{
		id: 'region2',
		name: {
			text: 'Region Two',
			x: 310,
			y: 310
		},
		area: {
			path: 'M300,300L400,300L400,400L300,400Z',
			fill: '#AAAA00'
		}
	},
	{
		id: 'region3',
		name: {
			text: 'Region Three',
			x: 110,
			y: 310
		},
		area: {
			path: 'M100,300L200,300L200,400L100,400Z',
			fill: '#AAAA00'
		}
	}
];

App.BOARD = {
	regions: App.REGIONS,
	paper: undefined
};

App.GAME = {
	chat: App.CHAT,
	board: App.BOARD
};


App.ApplicationRoute = Ember.Route.extend({
	renderTemplate: function(controller,model) {
		this._super();
		this.render( 'signin-form' , {
			into: 'application',
			outlet: 'signin'
		});
		this.render( 'chat' , {
			into: 'application',
			outlet: 'chat'
		});
	}
});


App.GameRoute = Ember.Route.extend({
	renderTemplate: function(controller,model) {
		this._super();

		// Create the game board
		$(function(){
			if (
				typeof model.board.paper === 'undefined'
			) {
				model.board.paper = Raphael('raphael-game-board',400,400);
				$.each(model.board.regions,function(){
					this.area.o = model.board.paper.path(
						this.area.path
					).attr({
						fill: this.area.fill
					});
					this.name.o = model.board.paper.text( 
						this.name.x, 
						this.name.y, 
						this.name.text 
					).attr({
						'text-anchor': 'start'
					});
				});
			}
		});

	},
	model: function() {
		return App.GAME;
	}
});


socket.on('connect',function(data){});

socket.on('messages',function(data){
	App.CHAT.unshiftObject(data);
});

socket.on('signedin',function(data){
	$('div.signin-modal').remove();
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