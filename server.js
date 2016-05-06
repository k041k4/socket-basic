var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {
  console.log('User connected via socket.io');

  socket.on('message', function (message) {
    message.time = moment().valueOf();
    console.log('Message received:');
    console.log(message.text);
    // socket.broadcast.emit('message', message);
    io.emit('message', message);
  });

  socket.emit('message', {
    text: 'Welcome to the chat app',
    time: moment().valueOf()
  });
});



http.listen(PORT, function() {
  console.log('HTTP Server Started');
});
