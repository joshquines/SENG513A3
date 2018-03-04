// shorthand for $(document).ready(...)
$(function chatHandler() {
    var socket = io();

    // CHAT STUFF
    $('form').submit(function(){
        socket.emit('chat', $('#m').val());
        // Parse message here
        if ($('#m').val().startsWith("/nick ")){
            socket.emit('changeUser', "yoyoyoyo");
        }
        else if($('#m').val().startsWith("/nickcolor ")){
            socket.emit('changeUserColor', "yoyoyoyo");
        }
        else{
            socket.on('chat', function chatHandler(msg){
                $('#messages').append($('<li>').text(msg + 'hahahaha'));
        });
    }
    return false;
    });

    // DO LOGIN STUFF HERE
    
});

