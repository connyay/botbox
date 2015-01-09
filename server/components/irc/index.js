'use strict';
var irc = require('irc');
var Message = require('../../api/message/message.model');

var client = new irc.Client('irc.devel.redhat.com', 'botbox', {
  autoConnect: false
});
client.connect(5, function(input) {
  console.log('Connected!');
  client.join('#LaCroix', function(input) {
    console.log('Joined #LaCroix');
  });
  client.join('#botboxTest', function(input) {
    console.log('Joined #botboxTest');
  });
});

client.addListener('message', function(from, to, text) {
  console.log(from + ' => ' + to + ': ' + text);
  console.log(arguments);
  Message.create({
    from: from,
    to: to,
    text: text
  }, function(err, message) {
    if (err) {
      console.error(err);
    } else {
      console.log('message saved', message);
    }
  });
});
