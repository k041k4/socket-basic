var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

function sendPrivateMessage(socket, message) {
  var currentUserInfo = clientInfo[socket.id];
  var vars = message.split(' ');
  var receiver = vars[1];
  var sendMessage = vars[2];

  Object.keys(clientInfo).forEach(function(socketId) {
    var userInfo = clientInfo[socketId];

    console.log(receiver + ' > ' + userInfo.name);

    if (receiver === userInfo.name) {

    console.log('send private message');

      io.sockets.connected[socketId].emit('message', {
        name: '[PRIVATE] ' + currentUserInfo.name,
        text: sendMessage,
        time: moment().valueOf()
      });
    }
  });
}


// send current users to provided socket
function sendCurrentUsers(socket) {
  var currentUserInfo = clientInfo[socket.id];
  var users = [];

  if (typeof currentUserInfo === 'undefined') {
    return;
  }
  Object.keys(clientInfo).forEach(function(socketId) {
    var userInfo = clientInfo[socketId];

    if (currentUserInfo.room === userInfo.room) {
      users.push(userInfo.name);
    }
  });

  socket.emit('message', {
    name: 'System',
    text: 'Current Users: ' + users.join(', '),
    time: moment().valueOf()
  });
}

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
    if (message.text === '@currentUsers') {  // special commands
      sendCurrentUsers(socket);
    } else if (message.text.indexOf('@private') > -1 ) {
      sendPrivateMessage(socket, message.text);
    }else {
      message.time = moment().valueOf();
      io.to(clientInfo[socket.id].room).emit('message', message);
    }
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
