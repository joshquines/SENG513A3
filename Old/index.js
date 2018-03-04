var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

http.listen( port, function () {
    console.log('listening on port', port);
});

app.use(express.static(__dirname + '/public'));


// Chatroom Variables
let numUsers = 0; // Number of users 
let usernames = []; // All users
let messageLog = []; // All messages

function nameGenerator(){
    let rand = Math.floor(Math.random() * 5001); 
    let username = "user" + rand.toString();
    return username
}


// listen to 'chat' messages
io.on('connection', function(socket){

    // LOGIN
    socket.on('userLogin', function(msg){
        console.log('Entering userLogin');
        // Create a username 
        socket.nickname = nameGenerator();
        socket.emit('chat', "My name is: " + socket.nickname);

        // Check if username not in use
        while(usernames.indexOf(socket.nickname) == -1){
            socket.emit('chat', "Username already in use");
            socket.nickname = nameGenerator;
        }

    })

    // CHANGE USERNAME
    socket.on('changeUser', function(nickname){
        // Check if nickname is not in use
        if (usernames.indexOf(nickname) == -1){
            // Apply new username

        }
        else{
            // Username cannot be changed
        }
    })

    // CHANGE COLOR

    // Chat Stuff


    socket.on('chat', function(msg){
	io.emit('chat', msg);
    });
});
