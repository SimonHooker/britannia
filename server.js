var express = require('express');
var lessMiddleware = require('less-middleware');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.compress());
app.use(lessMiddleware(__dirname+'/css'));
app.use('/fonts',express.static(__dirname+'/fonts'));
app.use('/images',express.static(__dirname+'/images'));
app.use('/tests',express.static(__dirname+'/tests'));

app.get('/',function(req, res){
	res.sendfile('./index.html');
});
app.get('/favicon.ico',function(req, res){
	res.sendfile('./favicon.ico');
});

app.get('/britannia.css',function(req,res){
	res.sendfile('./css/britannia.css');
});

app.get('/britannia.js',function(req,res){
	res.sendfile('./js/britannia.js');
});

io.on('connection',function(client){

	client.on('join',function(name){

		client.nickname = name;
		client.emit('signedin',{
			nickname: name
		});

	});

	client.on('messages',function(message){

		var transmitMe = {
			timestamp: new Date(),
			nickname: client.nickname,
			message: message
		};

		client.broadcast.emit('messages',transmitMe);
		client.emit('messages',transmitMe);

	});

});

server.listen(80);
console.log('Listening on port 80');