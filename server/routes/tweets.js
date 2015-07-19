var express = require('express');
var router = express.Router();
var tweetManager = require('../controllers/tweetManager.js');

// /get_tweet_page -- needs to know what search/event/etc, how many per page, and what page you're on
// req.event = event ID, not implemented yet
// req.page = page being requested (default = 1)
// req.per_page = how many per page (default = 10)
router.post('/get_tweet_page', function(req, res, next) {
 	// if there's an event, work within that event. if not, assume all tweets.
	if (req.body.event_id) {
		console.log(req.body);
		tweetManager.getTweetPage(req.body.per_page, req.body.page, req.body.event_id, function(tweets) {
      		console.log("Rendering: " + tweets);
			res.render('tweets', { tweets: tweets, title: 'Liberty Square Disassembly'})
	})
  	}
  	else {
    	console.log(req.body);
		tweetManager.getTweetPage(req.body.per_page, req.body.page, null, function(tweets) {
      		console.log("Rendering: " + tweets);
			res.render('tweets', { tweets: tweets, title: 'Liberty Square Disassembly'})
	})
}});

router.post('/get_tweet_count', function(req, res, next) {
  // if there's an event, work within that event. if not, assume all tweets.
	if (req.body.event_id) {
    	var event = event_collection[req.body.event_id];
    	console.log(event);
      	tweetManager.getTweetsBetween(event.start_date, event.end_date,     
        	function(tweets) { res.send({tweet_count: tweets.length})});
  	}
  	else {
    	res.send({tweet_count: tweet_collection.length});
  	}
});

router.post('/get_tweet_clusters', function(req, res, next) {
	tweetManager.getTweetClusters(tweet_collection, req.body.separation_in_hours, req.body.min_length, function(clusters) {
		res.send(clusters);
	});
});


/* router.post('/get_tweet', function(req, res, next) {
	tweetManager.get
} */

module.exports = router;
