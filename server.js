var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.get('/',function(req, res){
   res.sendfile('./index.html');
});

app.use(express.static('public'));
app.use('/js',express.static(__dirname+'/js'));
app.use('/css',express.static(__dirname+'/css'));
app.use('/fonts',express.static(__dirname+'/fonts'));

io.on('connection',function(client){

	client.on('join',function(name){

		client.nickname = name;

	});

	client.on('messages',function(message){

		var nickname = client.nickname;

		client.broadcast.emit('messages',nickname+': '+message);

		client.emit('messages',nickname+': '+message);

	});

});

server.listen(80);
console.log('Listening on port 80');