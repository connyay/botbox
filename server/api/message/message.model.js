'use strict';

var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
  from: String,
  to: String,
  text: String,
  date: {
    type: Date,
    default: Date.now
  }
});

MessageSchema.plugin(mongoosastic);

module.exports = mongoose.model('Message', MessageSchema);
