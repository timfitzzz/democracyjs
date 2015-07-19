var Tweet = require('../tweets/parser.js').Tweet;
var _und = require('underscore');
var moment = require('moment');

module.exports = {

	isAfter:
		function(tweet, date) {
			if (moment(tweet.created_at).isAfter(moment(date))) {
				return true;
			}
			else {
				return false;
			}
	},
	
	// getTweetsBetween: returns all tweets between two dates.
	getTweetsBetween:
		function(start_date, end_date, callback) {
			var start_index = 0;
			var end_index = 0;
			var that = this;
			_und.forEach(tweet_collection, function(tweet, i, collection) {
				if (that.isAfter(tweet, start_date) && start_index == 0) {
					start_index = i;
				}
				else if (that.isAfter(tweet, end_date) && end_index == 0) {
					end_index = i - 1;
					callback(tweet_collection.slice( start_index, end_index));
					return;
				}
				
			});
	},
	
	
  // getTweetPage: returns an array of X tweet objects from { page_no, per_page } as provided to page_data. Takes optional event ID.
	getTweetPage: 
		function(tweets_per_page, page_no, event_id, callback) {
			var number_of_tweets = parseInt(tweets_per_page) || 10;
			var start_index = parseInt(tweets_per_page*(page_no - 1)) || 0;
			var end_index = start_index + number_of_tweets;
            console.log("Getting " + number_of_tweets + " tweets from " + start_index + " to " + end_index + " from page " + page_no);
			if (event_id) {
				var event = event_collection[event_id];
                console.log("Event is " + event);
				this.getTweetsBetween(event.start_date, event.end_date, function(tweets) {
					callback(tweets.slice( start_index, end_index));
				});
			}
			else {			// unless there's an event indicated, assume entire collection
				callback(tweet_collection.slice( start_index, end_index));
			};
  	},
	
	getTweetCount: 
		function(event) {
			if (event) {
				// not a thing yet
			}
			else {
				callback(tweet_collection.length);
			}
  	},
  
  
  // getTweetClusters([Tweet], Number, Function([Array]) -> void) -> void
  // Takes array of Tweet documents and minimum length of time between clusters, calls back catalogue 
  // of groups of tweets (clusters) in order to suggest potential event definitions.
  //
	getTweetClusters: 
		function(tweets, separation_in_hours, min_length, callback) {
			// borrowed code, gives index where attribute is found
			function findWithAttr(array, attr, value) {
    			for(var i = 0; i < array.length; i += 1) {
        			if(array[i][attr] === value) {
            			return i;
        			}
    			}
			}			
			
			
        	// use _.map to generate array of boolean values:
        	// true: tweet at same index is more than length_in_hours hours after prior tweet
        	// false: tweet is less than length_in_hours after prior tweet
        	var starts_of_clusters = _und.map(tweets, function(tweet, index, tweets) {
        		if (index == 0) {
					return true;
				}
				else {
					var this_date = moment(tweet.created_at);
					var that_date = moment(tweets[index - 1].created_at);
					if (this_date.diff(that_date) > (separation_in_hours * 3600000)) {
						return true;
					}
					else {
					 return false;
					}
				}
        	});
			
			// now iterate through starts_of_clusters to build array of objects that define them:
			// { first_tweet_id_str: <id_str of first tweet in cluster>,
			//	 last_tweet_id_str: <id_str of last tweet in cluster>,
			//	 length_in_tweets: <number of tweets in cluster,
			//	 hashtags: { <hashtag string>: <number count>, etc },
			//	 users_in_cluster: [ user.name ],
			//	 start_date: Date,
			//	 duration_in_milliseconds: Number }
			//
			// first let's just build the array with first_tweet_id_str, then we can 
			// iterate through it to define all of the values.
			//
			var new_clusters = [];
			_und.forEach(starts_of_clusters, function(start, index, starts_of_clusters) {
				var this_cluster = {};
				if (start == true) {		// if start = true, build cluster definition
					// we already know the first tweet id string; it has the same index in
					// tweets as the start variable in starts_of_clusters.
					this_cluster.first_tweet_id_str = tweets[index].id_str;
					new_clusters.push(this_cluster);
				};
			});
			console.log(new_clusters);
			
			_und.forEach(new_clusters, function(cluster, index, new_clusters) {
				// define the cluster's hashtags and users arrays:
				cluster.hashtags = {};
				cluster.users_in_cluster = [];
				// let's locate our first tweet now just to get it out of the way.
				var first_tweet_index = findWithAttr(tweets, "id_str", cluster.first_tweet_id_str);
				if (index < new_clusters.length - 1) { // Now, as long as there is a next cluster...
					// ...get the first tweet id of the next cluster.
					var next_first_tweet_id_str = new_clusters[index+1].first_tweet_id_str;
					// ...now find its index in tweets.
					var next_first_tweet_index = findWithAttr(tweets, "id_str", next_first_tweet_id_str);
					// and you know the previous tweet in tweets is the one whose id_str you want.
					var last_tweet_index = next_first_tweet_index - 1;
					cluster.last_tweet_id_str = tweets[last_tweet_index].id_str;
					// you also know your cluster's length now.
					cluster.length_in_tweets = (last_tweet_index - first_tweet_index) + 1;
				}		// if this is the last cluster...
				else {
					var last_tweet_index = tweets.length - 1;
					cluster.last_tweet_id_str = tweets[last_tweet_index].id_str;
					cluster.length_in_tweets = last_tweet_index - first_tweet_index;
				}
				
				// set start date...
				cluster.start_date = tweets[first_tweet_index].created_at;
				
				// now figure out how long in time...
				cluster.duration_in_milliseconds = moment(tweets[last_tweet_index].created_at)
												   .diff(moment(tweets[first_tweet_index].created_at));
				
				// now we need to iterate through tweets between those two indexes to 
				// scrape the remaining data, hashtags and usernames.
				for (var i = first_tweet_index; i <= last_tweet_index; i++) {
					tweet = tweets[i];
					// first the username.
					if (!cluster.users_in_cluster[tweet.user.screen_name]) {
						cluster.users_in_cluster.push(tweet.user.screen_name);
						cluster.users_in_cluster = _und.uniq(cluster.users_in_cluster);
					}
					// now hashtags
					if (tweet.entities.hashtags.length > 0) {
						_und.forEach(tweet.entities.hashtags, function(hashtag) {
							if (cluster.hashtags[hashtag.text]) {
								// if it already exists, increment its value by 1
								cluster.hashtags[hashtag.text]++;
							}
							else {
								var newtag = {};
								newtag[hashtag.text] = 1;
								_und.extend(cluster.hashtags, newtag);
							}
									
						});
					}
				}
			});
			var final_clusters = [];
			_und.forEach(new_clusters, function(cluster, index, list) {
				if (cluster.length_in_tweets >= min_length) {
					final_clusters.push(cluster);
				}
			});
			callback(final_clusters);
  		},
	
	/* getSingleTweet: 
		function (tweets_per_page, page_no, event_id, callback) {
			var number_of_tweets = parseInt(tweets_per_page) || 10;
			// var start_index = parseInt(tweets_per_page*(page_no - 1)) || 0;
			var end_index = start_index + number_of_tweets;
			var tweet_index = end_index + 1
            console.log("Getting " + number_of_tweets + " tweets from " + start_index + " to " + end_index + " from page " + page_no);
			if (event_id) {
				var event = event_collection[event_id];
                console.log("Event is " + event);
				this.getTweetsBetween(event.start_date, event.end_date, function(tweets) {
					callback(tweets.slice( start_index, end_index));
				});
			}
			else {			// unless there's an event indicated, assume entire collection
				callback(tweet_collection.slice( start_index, end_index));
			};
		} */
}
  

var tests = {

  getTweetPage:	function() {
	module.exports.getTweetPage(10, 1, null, function(tweets) {
		if (tweets.length != 10) {
			console.log("getTweetPage failed to return correct number of tweets.")
		};
	});
  }
}