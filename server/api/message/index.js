'use strict';

var express = require('express');
var controller = require('./message.controller');

var router = express.Router();

router.post('/search', controller.search);
router.post('/display', controller.display);
router.get('/rooms', controller.rooms);

module.exports = router;
