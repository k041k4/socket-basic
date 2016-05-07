var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

io.on('connection', function(socket) {
  console.log('User connected via socket.io');

  // leave room
  socket.on('disconnect', function() {
    if (typeof clientInfo[socket.id] !== 'undefined') {
      socket.leave(clientInfo[socket.id].room);
      socket.broadcast.to(clientInfo[socket.id].room).emit('message',{
        name: "System",
        time: moment().valueOf(),
        text: clientInfo[socket.id].name + ' has left!'
      });
      delete clientInfo[socket.id];
    }
  });

  // join room
  socket.on('joinRoom', function (request) {
    clientInfo[socket.id] = request;
    socket.join(request.room);
    socket.broadcast.to(request.room).emit('message',{
      name: "System",
      time: moment().valueOf(),
      text: request.name + ' has joined!'
    });
  });

  // send message
  socket.on('message', function (message) {
    message.time = moment().valueOf();
    console.log('Message received:');
    console.log(message.text);
    io.to(clientInfo[socket.id].room).emit('message', message);
  });

  // connect to server
  socket.emit('message', {
    text: 'Welcome to the chat program',
    name: 'System',
    time: moment().valueOf()
  });
});



http.listen(PORT, function() {
  console.log('HTTP Server Started');
});
