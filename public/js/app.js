var socket = io();

socket.on('connect', function() {
  console.log('Connected to socket.io server!');
});

socket.on('message', function(message) {
//  var moment = moment();
  var now = moment.utc(message.time);

  console.log(now.format('h:mm:ss a'));

  console.log('New Message:');
  console.log(message.text);
  jQuery('.incomming-messages').append('<p><strong>' + now.local().format('h:mm:ss a') + '</strong> > ' + message.text + '</p>');
});

var $form = jQuery('#message-form');

$form.on('submit', function(event) {
  event.preventDefault();

  var $message = $form.find('input[name=message]');

  socket.emit('message', {
    text: $message.val()
  });

  $message.val('');
});
