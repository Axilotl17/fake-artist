
const URL = "http://localhost:3000";
const socket = io(URL, { autoConnect: false });

function ping() {
    socket.emit('ping', 1);
    console.warn("pinged from home")
}

socket.on('ping', function(msg) {
    console.warn("recieved: " + msg)
});

socket.on('joinedGame', function(arg1) {
    console.warn("joined game "+arg1)
});

socket.on('dumpBack', function(arg1) {
    console.log(arg1)
})

const joinGame = document.getElementById("joinGame")
const newGame = document.getElementById("newGame")
const gameCode = document.getElementById("gameCode")

joinGame.addEventListener('submit', function(e) {
    e.preventDefault()
    if(gameCode.value.length == 4) {
        socket.emit('joinGame', gameCode.value)
        console.log("submitted")
    } else {
        console.log("not 4 characters")
    }
});

newGame.addEventListener('click', function() {
    socket.connect(); 
    socket.emit('newGame')
});

