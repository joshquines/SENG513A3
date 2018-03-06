/*
    Marco Quines
    10138118
    SENG 513
    A3 
    B01
*/

var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

http.listen( port, function () {
    console.log('listening on port', port);
});

app.use(express.static(__dirname + '/public'));

// User + Chat Variables
let numUsers = 0;
let userList = [];
let chatMessages = [];
let colors = ["red", "blue", "green", "white", "yellow", "gray", "maroon", "pink", "purple", "lime", "aqua"];
let ul = "";

function nameGenerator(){
    let rand = Math.floor(Math.random() * 10001);
    let username = "User-" + rand.toString();
    return username;
}

// To see if user exists
function findUser(key, value) {
    for (var i = 0; i < userList.length; i++) {
        if (userList[i][key] === value) {
            // Username exists
            return true;
        }
    }
    // Username doesn't exist
    return false;
}

// User Connection
io.on('connection', function(socket){

    // Initialize Color
    socket.userColor = "white";

    // DISPLAY CHAT HISTORY
    for (let i = 0; i < chatMessages.length; i++){
        socket.emit('chat', chatMessages[i]);
    }

    // Generate username. Regenerate if username exists
    socket.nickname = nameGenerator();
    while (!(userList.indexOf(socket.nickname) == -1)){
        socket.nickname = nameGenertor();
    }

    io.emit('chat', socket.nickname + " has connected");
    socket.emit('chat', "Hello. Your username is ".fontcolor("white") + socket.nickname.fontcolor("white"));
    socket.emit('chat', "COMMANDS:".fontcolor("red"));
    socket.emit('chat', "\\nick newName : change your username".fontcolor("red"));
    socket.emit('chat', "\\nickcolor : change your color".fontcolor("red"));
    socket.emit('myusername', socket.nickname);
    userList.push(socket.nickname);

    // DISPLAY USER LIST
    ul = userList.join("\n").toString();
    io.emit('userlist', userList);


    // Listen on chat
    socket.on('chat', function(msg){
    
        // Check if user wants to change nickname
        if (msg.toString().startsWith("/nick ")){
            if(msg.substring(6) === ""){
                sendMessage(msg);
                // Just emit message
                let timestamp = new Date().toLocaleTimeString();
                let chatMessage = timestamp + " | " + socket.nickname + ": " + msg.toString();
                chatMessage = chatMessage.fontcolor(socket.userColor);
                chatMessages.push(chatMessage);
                socket.emit('userchat', chatMessage.bold());
                socket.broadcast.emit('chat', chatMessage);
                socket.emit('chat', "This is an invalid name");
            }
            else if(!(userList.indexOf(msg.substring(6)) == -1)){
                // Just emit message
                let timestamp = new Date().toLocaleTimeString();
                let chatMessage = timestamp + " | " + socket.nickname + ": " + msg.toString();
                chatMessage = chatMessage.fontcolor(socket.userColor);
                chatMessages.push(chatMessage);
                socket.emit('userchat', chatMessage.bold());
                socket.broadcast.emit('chat', chatMessage);
                socket.emit('chat', "This username is already in use.")
            }
            else{
                // Replace socket.nickname
                let index = userList.indexOf(socket.nickname);
                if (index!== -1){
                    userList.splice(index,1);
                }
                socket.nickname = msg.substring(6);
                socket.emit('myusername', socket.nickname);
                userList.push(socket.nickname);

                // Update UserList
                ul = userList.join("\n");
                io.emit('userlist', userList);

                // Just emit message
                let timestamp = new Date().toLocaleTimeString();
                let chatMessage = timestamp + " | " + socket.nickname + ": " + msg.toString();
                chatMessage = chatMessage.fontcolor(socket.userColor);
                chatMessages.push(chatMessage);
                socket.emit('userchat', chatMessage.bold());
                socket.broadcast.emit('chat', chatMessage);
            }

        // Check if user wants to change color
        }else if(msg.toString().startsWith("/nickcolor")){
            // Pick a random color from list
            let newColor = colors[Math.floor(Math.random() * colors.length)];
            socket.userColor = newColor;

            // Just emit message
            let timestamp = new Date().toLocaleTimeString();
            let chatMessage = timestamp + " | " + socket.nickname + ": " + msg.toString();
            chatMessage = chatMessage.fontcolor(socket.userColor);
            chatMessages.push(chatMessage);
            socket.emit('userchat', chatMessage.bold());
            socket.broadcast.emit('chat', chatMessage);
        
        }else{
            // Just emit message
            let timestamp = new Date().toLocaleTimeString();
            let chatMessage = timestamp + " | " + socket.nickname + ": " + msg.toString();
            chatMessage = chatMessage.fontcolor(socket.userColor);
            chatMessages.push(chatMessage);
            socket.emit('userchat', chatMessage.bold());
            socket.broadcast.emit('chat', chatMessage);
        }
    });

    // Remove From UserList on Disconnect
    socket.on('disconnect', function(msg){
        let index = userList.indexOf(socket.nickname);
        if (index!== -1){
            userList.splice(index,1);
        }

        // Update UserList
        ul = userList.join("\n");
        io.emit('userlist', userList);
        io.emit('chat', socket.nickname.fontcolor("white") + " has disconnected".fontcolor("white"));
    });
});
