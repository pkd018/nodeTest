var app = require('express').createServer()
	,io = require('socket.io').listen(app);

// 여기서 포트는 지정할 수 없고 하나만 쓸 수 있음. 미리정해진 상수.
app.listen(process.env.PORT);
console.log("port = " + process.env.PORT);

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });
  	socket.on('my other event', function (data) {
    	console.log(data);
  	});
});