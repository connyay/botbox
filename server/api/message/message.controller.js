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
    var firstHit = hits[0];
    if (!firstHit) {
      return res.status(404).send();
    }
    // Hacky and not right
    var dateRangeStart = moment(firstHit.date).startOf('day'),
      dateRangeEnd = moment(dateRangeStart).add(1, 'days');

    Message
      .find({
        to: {
          $in: rooms
        },
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
        hits.forEach(function(hit) {

          var msg = null,
            i;
          for (i = 0; i < messages.length; i++) {
            if (messages[i]._id.equals(hit._id)) {
              msg = messages[i];
              break;
            }
          }
          if (msg) {
            msg.highlight = true;
            msg.text = hit.text;
          }

        });
        res.json({
          rooms: rooms,
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
