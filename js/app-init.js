var App = Ember.Application.create();
var socket = io.connect('http://'+window.location.hostname+':80');

App.Router.map(function() {
	this.resource('game',{ path: '/' });
});

var mapDebugMode = ( window.location.search.substring(1) == 'mapdebug' );
