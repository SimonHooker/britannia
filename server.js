var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.get('/', function(req, res) {
   res.sendfile('./index.html');
});

app.use(express.static('public'));

io.on('connection',function(client){
	console.log('foo');
});

server.listen(80);
console.log('Listening on port 80');