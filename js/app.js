var App = Ember.Application.create();
var socket = io.connect('http://'+window.location.hostname+':80');

App.Router.map(function() {
	this.resource('game',{ path: '/' });
});

App.CHAT = [];

App.REGIONS = [
	{
		id: 'moray',
		name: {
			text: 'Moray',
			x: 440,
			y: 540
		},
		area: {
			path: 'M545,397L507,410L486,401L425,410L378,518L395,583L426,598L535,620L580,535L573,504L548,502L549,481L533,463L502,482L479,482L510,449L494,441L520,427L542,414L548,402Z',
			fill: '#006600'
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
/*
		this.render( 'signin-form' , {
			into: 'application',
			outlet: 'signin'
		});
*/
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
				model.board.paper = Raphael('raphael-game-board',1370,2274);
				$.each(model.board.regions,function(){
					this.area.o = model.board.paper.path(
						this.area.path
					).attr({
						fill: this.area.fill,
						opacity: 0.8
					});
					this.name.o = model.board.paper.text( 
						this.name.x, 
						this.name.y, 
						this.name.text 
					).attr({
						'text-anchor': 'start',
						'stroke': '#FFFFFF',
						'font-size': '20px'
					});
				});


				var insertDebugCoords = function() {
					var arrTemp = [];
					var pathTemp = undefined;

					var echoForm = $('<div>&nbsp;</div>');
					echoForm.insertBefore($('#raphael-game-board'));

					$('<button class="btn btn-danger">RESET</button>').on('click',function(e){
						e.preventDefault();
						arrTemp = [];
						if (pathTemp) {
							pathTemp.remove();
						}
					}).insertBefore($('#raphael-game-board'));

					var getPathFrom = function(arr) {
						var s = 'M'+arr.join('L')+'Z';
						echoForm.text(s);
						return s;
					};

					$('#raphael-game-board').on('click',function(e){

						console.log(e);
						posx = Math.round(e.pageX - $(this).offset().left);
						posy = Math.round(e.pageY - $(this).offset().top);

						arrTemp.push(posx+','+posy);

						if (pathTemp) {
							pathTemp.remove();
						}

						pathTemp = model.board.paper.path(
							getPathFrom( arrTemp )
						).attr({
							fill: '#FF0000',
							opacity: 0.5
						});
					});
				};
				insertDebugCoords();

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