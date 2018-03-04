// shorthand for $(document).ready(...)
window.onload=toBottom;

function toBottom()
{
alert("Scrolling to bottom ...");
window.scrollTo(0, document.body.scrollHeight);
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
        $('#messages').animate({scrollTop: $('#messages').prop("scrollHeight")}, 500);
        
    });
    socket.on('userchat', function chatHandler(msg){
        $('#messages').append($('<li>').html(msg)); 
        $('#messages').animate({scrollTop: $('#messages').prop("scrollHeight")}, 500);
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


// User List
// Get userList array userList from dict
function nicknameList(userList){
    var socket = io();

}