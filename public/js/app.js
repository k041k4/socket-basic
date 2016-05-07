var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room') || 'Main';
var socket = io();
var $room = jQuery('.room-title');

$room.text(room);

socket.on('connect', function() {
  console.log('Connected to socket.io server!');
});

socket.on('message', function(message) {
//  var moment = moment();
  var now = moment.utc(message.time);
  var $message = jQuery('.incomming-messages');

  $message.append('<p><strong>' + message.name + ' ' + now.local().format('h:mm:ss a') + '</strong></p>');
  $message.append('<p>' + message.text + '</p>');
});

var $form = jQuery('#message-form');

$form.on('submit', function(event) {
  event.preventDefault();

  var $message = $form.find('input[name=message]');

  socket.emit('message', {
    text: $message.val(),
    name: name
  });

  $message.val('');
});
