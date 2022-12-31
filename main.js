
const URL = "http://localhost:3000";
const socket = io(URL, { autoConnect: false });

function ping() {
    socket.emit('ping', 1);
}

socket.on('ping', function(msg) {
    console.warn("recieved: " + msg)
});

socket.on('joinedGame', function(code) {
    console.warn("joined game "+code)
});

socket.on('dumpBack', function(info) {
    console.log(info)
})

socket.on('joinFail', function(code, reason) {
    console.log('failed to join game '+code+'; '+reason)
})

const joinGame = document.getElementById("joinGame")
const newGame = document.getElementById("newGame")
const gameCode = document.getElementById("gameCode")

joinGame.addEventListener('submit', function(e) {
    e.preventDefault()
    if(gameCode.value.length == 4) {
        socket.connect(); 
        socket.emit('joinGame', gameCode.value)
    } else {
        console.log("not 4 characters")
    }
});

newGame.addEventListener('click', function() {
    socket.connect(); 
    socket.emit('newGame')
});

