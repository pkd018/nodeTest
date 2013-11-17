var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs');
    
app.listen(process.env.PORT || 9000);

function handler(req, res){
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
            res.writeHead(200);
            data = data.toString('utf-8').replace('<%=host%>', req.headers.host);
            res.end(data);
        }
    );
};

// socket.io ����
io.configure(function(){
    io.set('transports', ['xhr-polling']);
    io.set('polling duration', 10);
    io.set('log level', 2);
});

var socketRoom = {};

io.sockets.on('connection', function(socket){
    // ���ӿϷḦ �˸�.
    socket.emit('connected');
    
    // chat��û�� �� ��
    socket.on('requestRandomChat', function(data){
        // ����� �ִ��� Ȯ��
        console.log('requestRandomChat');
        var rooms = io.sockets.manager.rooms;
        for (var key in rooms){
            if (key == ''){
                continue;
            }
            // ȥ�������� ����
            if (rooms[key].length == 1){
                var roomKey = key.replace('/', '');
                socket.join(roomKey);
                io.sockets.in(roomKey).emit('completeMatch', {});
                socketRoom[socket.id] = roomKey;
                return;
            }
        }
        // ����� ������ ȥ�� �游��� ��ٸ�.
        socket.join(socket.id);
        socketRoom[socket.id] = socket.id;
    });
    
    // ��û ��� ��
    socket.on('cancelRequest', function(data){
        socket.leave(socketRoom[socket.id]);
    });
    
    // client -> server Message���� ��
    socket.on('sendMessage', function(data){
        console.log('sendMessage!');
        io.sockets.in(socketRoom[socket.id]).emit('receiveMessage', data);
    });
    
    // disconnect
    socket.on('disconnect', function(data){
        var key = socketRoom[socket.id];
        socket.leave(key);
        io.sockets.in(key).emit('disconnect');
        var clients = io.sockets.clients(key);
        for (var i = 0; i < clients.length; i++){
            clients[i].leave(key);
        }
    });
});