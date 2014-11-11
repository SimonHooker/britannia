App.BOARD = {
	regions: App.REGIONS,
	paper: undefined,
	regionareas: undefined
};

App.CHAT = [];

App.UNITS = [];

App.GAME = {
	chat: App.CHAT,
	board: App.BOARD,
	units: App.UNITS
};

App.ApplicationRoute = Ember.Route.extend({
	renderTemplate: function(controller,model) {
		this._super();
		
		if (!autologin) {
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

socket.on('spawn',function(data){
	var frame = $('#raphael-game-board');

	$.each(data,function(i,unit) {
		var el = $('<div class="unit"></div>')
		el.css({
			top: unit.y+'px',
			left: unit.x+'px'
		});
		frame.append(el);
		el.draggable({
			containment: '#raphael-game-board'
		});
	});
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

	// Render game board
		var model = App.GAME;

		model.board.paper = Raphael('raphael-game-board',1370,2274);

		model.board.regionareas = model.board.paper.set();

		var areaHoverCallback = function(areaSet,fill,stroke) {
			return function() {
				areaSet.attr({
					fill: fill,
					stroke: stroke
				});
			};
		};

		$.each(model.board.regions,function(i,region){

			region.area.o = model.board.paper.set();

			$.each( this.area.paths , function(j,path){
				region.area.o.push(
					model.board.paper.path(
						path
					)
				);
			});

			if (
				typeof region.area.stroke !== 'undefined'
			) {
				region.area.o.attr({
					stroke: region.area.stroke ,
					'stroke-width': ( region.area.width || 1 )
				});
			} else {
				region.area.o.attr({
					'stroke-width': 0
				});
			}


			if (
				typeof region.name !== 'undefined'
			) {
				region.name.o = model.board.paper.text( 
					region.name.x, 
					region.name.y, 
					region.name.text 
				).attr({
					'text-anchor': 'start',
					fill: '#FFFFFF',
					'font-size': '20px'
				});
			}

			if (
				typeof region.area.fill !== 'undefined'
			) {
				region.area.o.attr({
					fill: region.area.fill
				});

				region.area.o
					.mouseover(areaHoverCallback(region.area.o,shadeColor(region.area.fill,0.5),(region.area.stroke==region.area.fill)?shadeColor(region.area.stroke,0.5):region.area.stroke))
					.mouseout(areaHoverCallback(region.area.o,region.area.fill,region.area.stroke));
			}
		});
	
	if (autologin) {
		socket.emit( 'join' , 'autojoin-user' );
	}

});