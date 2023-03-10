const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('ping', msg => {
        io.emit('ping', msg) 
    });

    socket.on('newGame', function (){
        newRoom = roomCode()
        while(realRooms().includes(newRoom)){
            newRoom = roomCode()
            console.log("code used")
        }
        socket.join(newRoom)
        io.to(socket.id).emit('joinedGame', newRoom)
    })

    socket.on('joinGame', code => {
        if(realRooms().includes(code)){
            socket.join(code)
            io.to(socket.id).emit('joinedGame', code)
        } else {
            io.to(socket.id).emit('joinFail', code, 'room does not exist')
        }
    })

    socket.onAny((event, ...args) => {
        console.log(event, args);
    });

    socket.on('dump', function(){
        io.to(socket.id).emit('dumpBack', [realRooms(), Array.from(socket.rooms).splice(-1,1)])
    })
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/main.html');
});

app.get('/main.js', function(req, res) {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(__dirname + '/main.js');
});
app.get('/game.js', function(req, res) {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(__dirname + '/game.js');
});

function roomCode() {
    code = ""
    for(i=0; i<4; i++){
        code += String.fromCharCode((Math.floor(Math.random() * 26) + 65))
    }
    return code
}

function realRooms() {
    return Array.from(io.sockets.adapter.rooms.keys()).filter(key => key.length <= 4)
}
