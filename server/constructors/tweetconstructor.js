var _und = require('underscore');
var db = require('../util/db.js');
var collection = db.collection('tweets');
// Building the Tweet schema:
// 

// ...the following schemas - media, hashtags, user_mentions, and
// tweet_urls -- are subdocuments that we need for the main tweetSchema,
// of which a tweet may have more than one...

function TweetConstructor(tweet_json, donor) {
    
    // if encapsulated RT, act on retweeted_status value instead of entire tweet
    if (tweet_json.retweeted_status) {
        tweet_json = tweet_json.retweeted_status
    };
    
    _und.extend(this, tweet_json);
    this.created_at = new Date(this.created_at);
    this.donors = [];
    this.donors.push(donor);
    // console.log(this.id_str + " donated by " + this.donors);
}

//

// saveOrUpdate: saves document in database if new, updates RTs if exists already.
//               callback is either the result of the update, false if no update, 
//               or null if something went wrong.
TweetConstructor.prototype.saveOrUpdate = function(callback) {
    var cases = {
            0:  function(results) {     // if not found, add to database
                    collection.insert(this_tweet, function (err, receipt) {

                    if (!err) { callback(receipt); } else { console.log(err); } })
                },
            1:  function(results) {    // if found, check if can update RTs and call back result
                    if (this_tweet.retweet_count > results[0].retweet_count ||
                    (this_tweet.retweet_count && !results[0].retweet_count ))
                   /* use || to add other potential updates here */ {
                    collection.update(
                        { id_str: this_tweet.id_str },
                        { $set: { retweet_count: this_tweet.retweet_count }
                                //add new updates here too
                        },
                        function(err, receipt) {
                            if (!err) {
                                // process.stdout.write("^");
                                callback(receipt)
                            } else { console.log(err) }
                        });
                    }
                    else {  // if no change was made to db, call back false
                        callback("skipped");
                    }
                },
            2:  function() { console.log("Found 2, wtf: " + results); },
            /* default:    function(results){ // otherwise, callback null, which is "wtf"
                            console.log("Something weird happened: " + results);
                            callback(null);
                        } */
    };
    var this_tweet = this;
    collection.find({ id_str: this_tweet.id_str }, function(err, results) {
        cases[results.length](results) // || cases.default(results);
    });
};



    /*
        var cases = [
            0:  function() {     // if not found, add to database
                    collection.insert(this_tweet, function(err, receipt) {
                    if (!err) { callback(receipt) } else { console.log(err) }})
                },
            1:  function() {    // if found, check if can update RTs and call back result
                    if (this_tweet.retweet_count > results[0].retweet_count ||
                    (this_tweet.retweet_count && !results[0].retweet_count ))
                   /* use || to add other potential updates here  {
                    collection.update(
                        { id_str: this_tweet.id_str },
                        { $set: { retweet_count: this_tweet.retweet_count }
                                //add new updates here too */ /*
                        },
                        function(err, receipt) {
                            if (!err) {
                                // process.stdout.write("^");
                                callback(receipt)
                            } else { console.log(err) }
                        });
                    }
                    else {  // if no change was made to db, call back false
                        callback("skipped");
                    }
                },
            default:    function(){ // otherwise, callback null, which is "wtf"
                            callback(null);
                        }
        ];









            0:  collection.insert(this_tweet, function(err, receipt) {              // if not found, add to database
                    if (!err) { callback(receipt) } else { console.log(err) }});
            1:  if (this_tweet.retweet_count > results[0].retweet_count ||          // if found, check if useful update and return result
                    (this_tweet.retweet_count && !results[0].retweet_count ))
                   /* use || to add other potential updates here */ /* {
                    collection.update(
                        { id_str: this_tweet.id_str },
                        { $set: { retweet_count: this_tweet.retweet_count }
                                //add new updates here too
                        },
                        function(err, receipt) {
                            if (!err) {
                                // process.stdout.write("^");
                                callback(receipt)
                            } else { console.log(err) }
                        });
                }
                else {  // if no change was made to db, call back false
                    callback("skipped");
                }
        }










    var this_tweet = this;
    collection.find({ id_str: this_tweet.id_str }).toArray(function(err, results) {
        switch (results.length) {
            case 0:  // if not found, add to database
                collection.insert(this_tweet, function(err, receipt) {
                    // process.stdout.write("+");
                    if (!err) { callback(receipt) } else { console.log(err) }});
                break;
            case 1:  // if found, check if useful update and return result
                if (this_tweet.retweet_count > results[0].retweet_count ||
                    (this_tweet.retweet_count && !results[0].retweet_count ))
                   /* use || to add other potential updates here */ /* {
                    collection.update( 
                        { id_str: this_tweet.id_str },
                        { $set: { retweet_count: this_tweet.retweet_count }
                                //add new updates here too 
                        },
                        function(err, receipt) {
                            if (!err) {
                                // process.stdout.write("^");
                                callback(receipt)
                            } else { console.log(err) }
                        });
                }
                else {  // if no change was made to db, call back false
                    // process.stdout.write("_");
                    callback("skipped");
                }
                break;
            default: // otherwise, callback null, which is "wtf"
                    callback(null);
                break;
        }
    })


};
*/

module.exports = TweetConstructor;

/*
var mediaSchema = Schema({
  display_url: String,
  expanded_url: String,
  id: Number,
  id_str: String,
  indices: [
    Number, Number
  ],
  media_url: String,
  media_url_https: String,
  sizes: {
    thumb: {
      h: Number,
      resize: String,
      w: Number
    },
    large: {
      h: Number,
      resize: String,
      w: Number
    },
    medium: {
      h: Number,
      resize: String,
      w: Number
    }, 
    small: {
      h: Number,
      resize: String,
      w: Number
    }
  },
  type: String,
  url: String
});

var hashtagsSchema = Schema({
  text: String,
  indices: [ Number, Number ]
});

var user_mentionsSchema = Schema({
  id: Number,
  id_str: String,
  name: String,
  screen_name: String,
  indices: [
    
    Number, Number
    
  ]
});

var tweet_urlsSchema = Schema({
  display_url: String,
  expanded_url: String,
  indices: [ Number, Number ],
  url: String  
});

//retweeted_status is the tweetSchema itself, for one-level-descended retweet data.
var retweeted_statusSchema = Schema({
  _id: String,
  source: String,
  entities: {
    media: [mediaSchema],
    hashtags: [hashtagsSchema],
    urls: [tweet_urlsSchema],
    user_mentions: [user_mentionsSchema]
  },
  geo: { coordinates: [Number, Number] },
  favorited: Boolean,
  id_str: String,
  text: String,
  id: Number,
  created_at: String,
  in_reply_to_screen_name: String,
  in_reply_to_status_id: Number,
  in_reply_to_status_id_string: String,
  in_reply_to_user_id: Number,
  in_reply_to_user_id_str: String,
  retweet_count: mongoose.Schema.Types.Mixed,
  retweeted: Boolean,
  truncated: Boolean,
  user: {
    name: String,
    screen_name: String,
    protected: Boolean,
    id_str: String,
    profile_image_url_https: String,
    id: Number,
    verified: Boolean 
  },
});

// ...and finally, the tweetSchema itself, containing all the above document
// types as well as many singular values. Custom values are last.

var tweetSchema = Schema({
  _id: String,
  source: String,
  entities: {
    media: [mediaSchema],
    hashtags: [hashtagsSchema],
    urls: [tweet_urlsSchema],
    user_mentions: [user_mentionsSchema]
  },
  geo: { coordinates: [Number, Number] },
  favorited: Boolean,
  id_str: String,
  text: String,
  retweeted_status: [retweeted_statusSchema],
  id: Number,
  created_at: String,
  in_reply_to_screen_name: String,
  in_reply_to_status_id: Number,
  in_reply_to_status_id_string: String,
  in_reply_to_user_id: Number,
  in_reply_to_user_id_str: String,
  retweet_count: mongoose.Schema.Types.Mixed,
  retweeted: Boolean,
  truncated: Boolean,
  user: {
    name: String,
    screen_name: String,
    protected: Boolean,
    id_str: String,
    profile_image_url_https: String,
    id: Number,
    verified: Boolean 
  }
 },
{ collection: 'tweets'}
);
*/

// Aaaaand export the schema.
// module.exports = mongoose.model('Tweet', tweetSchema);