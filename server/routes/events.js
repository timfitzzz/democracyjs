var express = require('express');
var router = express.Router();
var eventManager = require('../controllers/eventManager.js');
var tweetManager = require('../controllers/tweetManager.js');

/* GET home page. */
router.get('/:event_id', function(req, res, next) {
	var event = eventManager.getEvent(req.params.event_id, function(event) {

		res.render('event', { title: event.name, event: event });
	});
});

router.get('/json/:event_id', function(req, res, next) {
	var event = eventManager.getEvent(req.params.event_id, function(event) {
		tweetManager.getTweetsBetween(event.start_date, event.end_date, function(tweets) {
			res.send(tweets);
		});
	});
});

module.exports = router;
