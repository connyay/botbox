'use strict';
var irc = require('irc');
var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
  from: String,
  to: String,
  text: String,
  date: Date
});

MessageSchema.plugin(mongoosastic);

var Message = mongoose.model('Message', MessageSchema);

mongoose.connect('mongodb://localhost/irc-index');

var client = new irc.Client('irc.devel.redhat.com', 'botbox', {
  autoConnect: false
});
client.connect(5, function(input) {
  console.log('Connected!');
  client.join('#LaCroix', function(input) {
    console.log('Joined #LaCroix');
  });
});

client.addListener('message', function(from, to, text) {
  console.log(from + ' => ' + to + ': ' + text);
  console.log(arguments);
  Message.create({
    from: from,
    to: to,
    text: text,
    date: new Date()
  }, function(err, message) {
    if (err) {
      console.error(err);
    } else {
      console.log('message saved', message);
    }
  });
});
