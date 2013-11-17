var app = require('express').createServer()
	,io = require('socket.io').listen(app);

// ���⼭ ��Ʈ�� ������ �� ���� �ϳ��� �� �� ����. �̸������� ���.
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