var fs = require('fs');
var _und = require('underscore')._;
var moment = require('moment');

var manually_fixed_images = require('../util/manually_fixed_images.js');

function correctImageURL(twimg_url) {
	var bad_url = twimg_url;
	var keeper = bad_url.substr(bad_url.indexOf("."));
	var good_url = "https://pbs" + keeper;
		return good_url;
}

var parser = {

	// new Tweet({JSON}, String) -> Tweet
	Tweet: function (disk_tweet, donor) {
		// if encapsulated RT, act on retweeted_status value instead of entire tweet
    	if (disk_tweet.retweeted_status) {
        	disk_tweet = disk_tweet.retweeted_status;
    	}

    	_und.extend(this, disk_tweet);
    	this.created_at = new Date(this.created_at);
			var created_at_en = moment(this.created_at);
			this.created_at_en = created_at_en.format('LLLL');
    	this.donors = [];
    	this.donors.push(donor);
			this.user.profile_image_url_https = correctImageURL(this.user.profile_image_url_https);
    	// console.log(this.id_str + " donated by " + this.donors);
			if (manually_fixed_images[this.user.screen_name]){
				this.user.profile_image_url_https = manually_fixed_images[this.user.screen_name];
			}
	},

	// parseDiskTweet({JSON}, String) -> new Tweet() -> Tweet
	parseDiskTweet: function (disk_tweet, donor) {
		return new this.Tweet(disk_tweet, donor);
	},

	// parseDiskTweets([{JSON}], String) -> [{Tweet}]
	parseDiskTweets: function (disk_tweets, donor)	{
		var that = this;
		// _.map(function (t) { return disk_tweets(t, donor) }, parseDiskTweet);
		return _und.map(disk_tweets, function(disk_tweet) {
			return that.parseDiskTweet(disk_tweet, donor);
		});
	},

	// parseDiskTweetsFileContent(String, String) -> [{Tweet}]
	parseDiskTweetsFileContent: function (content, donor) {
		var disk_tweets = JSON.parse(content.substring(content.indexOf("[")));
  		return this.parseDiskTweets(disk_tweets, donor);
	},

	// parseDiskTweetFile(String, String, function([{Tweet}]) -> void) -> void
	parseDiskTweetsFile: function (filename, donor, callback) {
		var that = this;
		fs.readFile(filename, 'utf8', function(err, file_contents) {  // Read in file and pass to callback
    		if (err) {
      			console.log(err);
    		}
    		else if (file_contents.substr(0,9) !== "Grailbird") {  // If the file is not valid, skip and notify.
      			console.log("-- File " + file + " was not a valid Grailbird data file and was skipped.");
      			callback([]);      // Still call back an empty array so it's accounted for.
    		}
    		else
      			callback(that.parseDiskTweetsFileContent(file_contents, donor));
  			});
	},

	// parseDiskTweetDir(String, function([{Tweet}]) -> void) -> void
	parseDiskTweetsDir: function(tweets_dir, tweet_dir, callback) {
		var that = this;
		var donor = tweet_dir;
		fs.readdir(tweets_dir + "/" + tweet_dir, function(err, files) {   // Get files from dir
        	if(!err) {
				var tweets_from_dir = [];
				var files_loaded = 0;
            	files = files.filter(function(file) { return (file[0] !== '.'); });  // Ignore hidden ones
            	files.forEach( function( file, i ) {   // For each file, add absolute path to array.
                	files[i] = tweets_dir + "/" + tweet_dir + '/' + file;
        		});
        		files.forEach(function(file, j) {		// for each file...
					that.parseDiskTweetsFile(file, donor, function(tweets_from_file) {	/// parse and pass [{Tweets}] to callback
						tweets_from_dir[j] = tweets_from_file;				// store file tweets in right part of dir array
						files_loaded++;										// note the file is done
						if (files_loaded == files.length) {					// when all files are received...
							callback(_und.flatten(tweets_from_dir));		// pass the array from this folder to callback
						}
					});
				});
        	}
        	else {
            	console.log(err);
        	}
    	});
	},

	// parseDiskTweetDirs(String, function([{Tweet}] -> void) -> void
	parseDiskTweetsDirs: function (tweets_dir, callback) {
		var that = this;
		var tweets_from_dirs = [];
		dirs_loaded = 0;
		fs.readdir(tweets_dir, function(err, tweet_dirs) {
			if(!err) {
            	tweet_dirs = tweet_dirs.filter(function(tweet_dir) {                                  // Filter out any non-dirs inside
                	return fs.statSync(tweets_dir + "/" + tweet_dir).isDirectory();
            	});
            	tweet_dirs = tweet_dirs.filter(function(tweet_dir) { return (tweet_dir[0] !== '.'); });     // Filter out any hidden dirs
            	tweet_dirs.forEach(function(tweet_dir, i) {
					that.parseDiskTweetsDir(tweets_dir, tweet_dir, function(tweets_from_dir) {
						tweets_from_dirs[i] = tweets_from_dir;
						dirs_loaded++;
						if (dirs_loaded == tweet_dirs.length) {
							callback(_und.flatten(tweets_from_dirs));
						}
					});
				});

			}// Send to callback
        	else {
            	console.log(err);
        	}
		});
	},

	// parseDiskTweets(root_tweets_dir, function([Tweet]) -> void) -> void
	//
	// Returns variable containing array of Tweet objects from any Grailbird files stored in subfolders of supplied root folder (CPS).
	// Array returned is sorted by id_str and de-duplicated. Duplicate tweets end up with one entry in donors for each copy of the tweet.

	parseDiskTweetsWithin: function(tweets_dir, callback) {
		this.parseDiskTweetsDirs(tweets_dir, function(tweets_from_dirs) {
			var tweets_by_id_str = _und.sortBy(tweets_from_dirs, 'id_str');
			var parsed_tweets = [];
			var tweets_parsed = 0;
			tweets_by_id_str.forEach(function(tweet) {				// de-dupe
				if (parsed_tweets.length > 0 && tweet.id_str == parsed_tweets[parsed_tweets.length - 1].id_str) {
					var new_donor = tweet.donors[0];
					tweets_by_id_str[tweets_by_id_str.length - 1].donors.push(new_donor);
				}
				else {
					parsed_tweets.push(tweet);
				}
				if (tweets_parsed++ == tweets_by_id_str.length - 1) {
					console.log("Found " + parsed_tweets.length + " unique tweets.");
					callback(parsed_tweets);
				}
			});
		});
	}
};

module.exports = parser;
