function scroll(){
    var scrollDiv = document.getElementById("chatdiv");
    scrollDiv.scrollTop = scrollDiv.scrollHeight;
}
$(function chatHandler() {
    var socket = io();
    $('form').submit(function chatHandler(){
        socket.emit('chat', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('chat', function chatHandler(msg){
        $('#messages').append($('<li>').html(msg));
        scroll();
    });
    socket.on('userchat', function chatHandler(msg){
        $('#messages').append($('<li>').html(msg)); 
        scroll();
    });

    socket.on('myusername', function chatHandler(msg){
        $('#myusername').html("Your Username: " + msg);
    });

    socket.on('userlist', function chatHandler(msg){
        $('#userlist').html("");
        let list = [];
        list = msg;
        
        for (let i = 0; i < list.length; i++){
            $('#userlist').append($('<li>').text(list[i]));
        } 
    });
});


