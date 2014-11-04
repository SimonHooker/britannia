var express = require('express');
var lessMiddleware = require('less-middleware');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(lessMiddleware(__dirname+'/css'));
app.use('/js',express.static(__dirname+'/js'));
app.use('/fonts',express.static(__dirname+'/fonts'));

app.get('/',function(req, res){
	res.sendfile('./index.html');
});

app.get('/britannia.css',function(req,res){
	res.sendfile('./css/britannia.css');
});

io.on('connection',function(client){

	client.on('join',function(name){

		client.nickname = name;

	});

	client.on('messages',function(message){

		var nickname = client.nickname;

		client.broadcast.emit('messages',{
			nickname: client.nickname,
			message: message
		});

		client.emit('messages',{
			nickname: client.nickname,
			message: message
		});

	});

});

server.listen(80);
console.log('Listening on port 80');