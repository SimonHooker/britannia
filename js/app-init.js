var App = Ember.Application.create();
var socket = io.connect('http://'+window.location.hostname+':80');

App.Router.map(function() {
	this.resource('game',{ path: '/' });
});

var autologin = ( window.location.search.substring(1) == 'autologin' );

var shadeColor = function(color, percent) {   
	var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
	return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
};