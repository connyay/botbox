'use strict';

var Message = require('./message.model');
var moment = require('moment');
var mongoose = require('mongoose');

var ALL_ROOMS = 'All Rooms';

// Creates a new message in the DB.
exports.search = function(req, res) {
  if (req.body.room === ALL_ROOMS) {
    req.body.room = '*';
  }
  var query = {
    query: {
      bool: {
        must: [{
          query_string: {
            default_field: 'text',
            query: req.body.text
          }
        }, {
          query_string: {
            default_field: 'to',
            query: req.body.room
          }
        }]
      }
    },
    highlight: {
      pre_tags: ['<mark>'],
      post_tags: ['</mark>'],
      fields: {
        text: {}
      }
    }
  };
  Message.search(query, function(err, results) {
    if (err) {
      return res.status(500).json(err);
    }
    var hits = [],
      rooms = [];
    if (results && results.hits && results.hits.hits && results.hits.hits.length) {
      results.hits.hits.forEach(function(hit) {
        var _hit = hit._source;
        _hit._id = mongoose.Types.ObjectId(hit._id);
        if (hit.highlight && hit.highlight.text) {
          _hit.text = hit.highlight.text[0];
        }
        hits.push(_hit);
        var room = _hit.to;
        if (rooms.indexOf(room) === -1) {
          rooms.push(room);
        }
      });
    }
        res.json({
          rooms: rooms,
          messages: hits
        });
      });
};

exports.display = function(req, res) {
    console.log(req.body._id);
    console.log(mongoose.Types.ObjectId(req.body._id));
    var objId = mongoose.Types.ObjectId(req.body._id);
    console.dir(objId);
    Message.findById(objId, function (err, message) {
	console.log(arguments);
        

    // Hacky and not right
    var dateRangeStart = moment(message.date).startOf('day'),
      dateRangeEnd = moment(dateRangeStart).add(1, 'days');

    Message
      .find({
        to: message.to,
        date: {
          $gte: dateRangeStart.toDate(),
          $lt: dateRangeEnd.toDate()
        }
      })
      .sort({
        date: 1
      })
      .lean()
      .exec(function(err, messages) {
        if (err) {
          return res.status(500).json(err);
        }
        res.json({
          messages: messages
        });
      });
  });
};


exports.rooms = function(req, res) {
  Message.distinct('to', function(err, rooms) {
    if (err) {
      return res.status(500).json(err);
    }
    rooms.unshift(ALL_ROOMS);
    res.json(rooms);
  })
};
