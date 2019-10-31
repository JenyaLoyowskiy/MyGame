var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var usersCount = 0;
var usersReady = 0;
var game = require('./game');
var newGame;
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    usersCount++;
    console.log('a user connected', usersCount);
    socket.emit('user connected', usersCount);
    socket.on('disconnect', function(){
        console.log('user disconnected');
        socket.emit('user disconnected');
        usersCount--;
    });
    socket.on('check ready', function(){
        usersReady++;
        if (usersCount == usersReady){
            console.log('user ready', usersReady);
            console.log('start game');
            socket.emit('start game', usersReady);
            newGame = game();
            console.log(newGame);
        } else {
            console.log('user ready', usersReady);
        }
    });
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
    });
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});