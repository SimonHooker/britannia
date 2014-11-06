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
			paths: [
				'M545,397L507,410L486,401L425,410L378,518L395,583L426,598L535,620L580,535L573,504L548,502L549,481L533,463L502,482L479,482L510,449L494,441L520,427L542,414L548,402Z'
			],
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
			paths: [
				'M422,406L489,395L495,399L524,394L530,375L607,315L621,292L649,278L649,231L612,211L605,223L481,240L473,227L416,206L385,265L387,289L356,298L362,325L345,332L347,343L362,371Z'
			],
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
			paths: [
				'M419,415L373,511L373,522L391,584L396,590L423,599L414,684L327,685L351,636L290,705L259,687L249,651L221,646L240,624L265,621L274,596L259,593L278,547L300,520L296,503L285,450L297,388L349,371Z',
				'M207,602L212,568L185,559L183,581Z',
				'M290,714L277,736L260,741L257,724L222,743L194,748L184,724L218,723L223,700L198,688L204,669L225,663L245,678L250,694Z',
				'M241,579L243,575L245,554L256,543L249,532L238,545L197,511L199,494L186,489L182,502L163,484L165,459L179,461L185,454L178,450L178,432L187,430L197,451L211,452L209,437L221,416L231,419L248,464L246,474L257,491L261,510L293,514L287,523L274,530L271,539L269,552L254,576Z',
				'M226,596L214,608L218,619L233,619L233,602Z'
			],
			fill: '#006600'
		}
	},
	{
		id: 'orkneys',
		name: {
			text: 'Orkneys',
			x: 630,
			y: 118
		},
		area: {
			paths: [
				'M618,103L610,151L650,160L650,178L664,192L677,170L694,150L678,135L697,112L715,118L711,101L720,79L722,66L696,81L670,78L657,58L648,64L648,80L629,96L630,104Z',
				'M605,167L616,158L641,183L632,189L620,189Z'
			],
			fill: '#006600'
		}
	},
	{
		id: 'mar',
		name: {
			text: 'Mar',
			x: 647,
			y: 528
		},
		area: {
			paths: [
				'M538,459L553,477L553,496L575,498L583,530L602,561L607,580L629,598L635,616L657,626L657,681L708,672L710,661L735,655L751,623L768,553L801,512L799,462L785,446L726,452L675,441L641,447L606,436L587,437L558,445Z'
			],
			fill: '#006600'
		}
	},
	{
		id: 'alban',
		name: {
			text: 'Alban',
			x: 502,
			y: 652
		},
		area: {
			paths: [
				'M427,602L414,715L476,721L492,737L574,720L655,683L656,628L633,618L627,600L604,583L599,563L599,562L582,539L537,623Z'
			],
			fill: '#006600'
		}
	},
	{
		id: 'hebridies',
		name: {
			text: 'Hebridies',
			x: 149,
			y: 308
		},
		area: {
			paths: [
				'M99,375L135,401L161,384L168,380L177,348L188,356L216,342L222,319L237,282L254,267L257,238L246,223L222,244L201,256L195,268L177,274L173,283L161,279L156,294L143,283L132,316L138,330L126,338L131,351Z',
				'M111,403L99,413L74,409L70,424L90,441L106,444L115,435L125,431Z',
				'M75,449L101,449L101,468L77,467Z',
				'M65,537L87,547L91,540L83,532L83,528L89,528L90,516L91,489L87,479L73,477L75,493L65,504Z',
				'M63,549L70,553L73,563L77,568L75,577L63,584L47,583L54,564L59,560Z'
			],
			fill: '#006600'
		}
	},
	{
		id: 'dunedin',
		name: {
			text: 'Dunedin',
			x: 511,
			y: 769
		},
		area: {
			paths: [
				'M492,738L578,722L658,684L708,674L718,672L694,714L678,722L650,726L636,722L626,726L618,736L602,748L590,750L594,756L606,756L622,744L640,740L644,734L662,736L664,752L696,772L694,778L664,790L648,790L624,810L626,822L606,824L590,818L572,824L554,820L546,814L542,818L552,832L590,838L646,838L648,826L654,820L682,820L688,830L712,850L706,868L688,868L682,878L652,880L648,890L634,888L622,908L614,908L614,900L594,900L584,890L574,892L570,896L548,892L534,878L536,868L522,860L518,850L504,848L490,836L490,822L484,812L480,764L488,758Z'
			],
			fill: '#66AA66'
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
				$.each(model.board.regions,function(i,region){

					region.area.o = model.board.paper.set();

					$.each( this.area.paths , function(j,path){
						region.area.o.push(
							model.board.paper.path(
								path
							)
						);
					});

					region.area.o.attr({
						fill: region.area.fill,
						opacity: 0.8
					});


					region.name.o = model.board.paper.text( 
						region.name.x, 
						region.name.y, 
						region.name.text 
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