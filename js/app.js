var App = Ember.Application.create();
var socket = io.connect('http://'+window.location.hostname+':80');

App.Router.map(function() {
	this.resource('game',{ path: '/' });
});

App.CHAT = [];

var mapDebugMode = ( window.location.search.substring(1) == 'mapdebug' );


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
	},
	{
		id: 'caithness',
		name: {
			text: 'Caithness',
			x: 440,
			y: 300
		},
		area: {
			path: 'M422,406L489,395L495,399L524,394L530,375L607,315L621,292L649,278L649,231L612,211L605,223L481,240L473,227L416,206L385,265L387,289L356,298L362,325L345,332L347,343L362,371Z',
			fill: '#006600'
		}
	},
	{
		id: 'moray',
		name: {
			text: 'Skye',
			x: 307,
			y: 563,
		},
		area: {
			path: 'M419,415L373,511L373,522L391,584L396,590L423,599L414,684L327,685L351,636L290,705L259,687L249,651L221,646L240,624L265,621L274,596L259,593L278,547L300,520L296,503L285,450L297,388L349,371Z',
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
		if (!mapDebugMode) {
			this.render( 'signin-form' , {
				into: 'application',
				outlet: 'signin'
			});
		}
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
						'fill': '#FFFFFF',
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

					$('#raphael-game-board').css({
						'background-image': "url('/images/map_1370.jpg')"
					}).on('click',function(e){

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
				if (mapDebugMode) {
					insertDebugCoords();
				}

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