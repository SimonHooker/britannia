var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.get('/', function(req, res) {
   res.sendfile('./index.html');
});
app.get('/jquery.js', function(req, res) {
   res.sendfile('./jquery-2.1.1.min.js');
});

app.use(express.static('public'));

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