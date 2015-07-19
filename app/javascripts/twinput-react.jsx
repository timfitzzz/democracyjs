// This is the structure I am trying to model with React.js; the same as current builds of twinput-sandbox.
// A "story" is any view of elements, which for now of course can only be tweets. Displaying other elements later will be simple with React.
//

// JSLint exceptions...
/*global React*/
/*global _*/
/*global document*/

/* StoryContainer
	StoryBrowserColumn
		Paginater
		StoryElementsContainer
			StoryElement
				[TweetBody, etc]
					TweetUser
						TweetUserAvatar
						TweetUserName
						TweetUserScreenName
					TweetText
					TweetFooter
				ElementTools
					DeleteButton
*/

// These storyElements have the minimum attributes necessary for a Tweet.
var storyElements = {
	tweets: [
		{
			url: "http://sadtrombone.com",
			created_at: new Date(),
			text: "Oh my god, that's the funky shit!",
			user: {
				name: "Richard",
				screen_name: "TheGrabbee",
				profile_image_url_https: "https://i.embed.ly/1/display/resize?key=1e6a1a1efdb011df84894040444cdc60&url=http%3A%2F%2Fa0.twimg.com%2Fsticky%2Fdefault_profile_images%2Fdefault_profile_0_normal.png"
			}
		},
		{
			text: "Letst me hearest thou say: woompst, there it shall forever and always be, as is the long-sacred custom of our time-honored land.",
			url: "http://boomshayaka.com",
			created_at: new Date(),
			user: {
				name: "Whoomp",
				screen_name: "thereitis",
				profile_image_url_https: "https://i.embed.ly/1/display/resize?key=1e6a1a1efdb011df84894040444cdc60&url=http%3A%2F%2Fa0.twimg.com%2Fsticky%2Fdefault_profile_images%2Fdefault_profile_0_normal.png"
			}
		}
	]
};

var TweetDeleteButton = React.createClass({

	handleClick: function() {
		var to_delete = [];
		to_delete.push(this.props.index);
		this.props.onUserDeletion(
			to_delete
		);
	},

	render: function() {
		var tweet_index = this.props.index;
		return (
			<div className="tweet-margin-buttons">
					<button onClick={this.handleClick}>
						<p>X</p>
					</button>
			</div>
		);
	}
});


// TweetUserAvatar needs a user's profile_image_url_https value.
var TweetUserAvatar = React.createClass({
		render: function () {
			var image_url = this.props.profile_image_url_https;
			return (
				<span className="avatar tweet-avatar">
					<img src={image_url} />
				</span>
			);
		}
});

// TweetUserName needs a user's name, passed in as user_name.
var TweetUserName = React.createClass({
		render: function () {
			var user_name = this.props.user_name;
			return (
				<span className="p-name">{user_name}</span>
            );
		}
});

// TweetUserScreenName needs a user's screen name, passed in as screen_name.
var TweetUserScreenName = React.createClass({
		render: function () {
			var screen_name = this.props.screen_name;
			return (
				<span> @{this.props.screen_name} </span>
			);
		}
});

// TweetUser needs the "user" object within the tweet object, to build the User components.
var TweetUser = React.createClass({
		render: function () {
			var user = this.props.user;
			return (
				<div className="p-author h-card tweet-div">
					<a className="screen-name u-url tweet-p" href="https://twitter.com/#{screen_name}">
						<TweetUserAvatar profile_image_url_https={user.profile_image_url_https} />
						<TweetUserName user_name={user.name} />
						<TweetUserScreenName screen_name={user.screen_name} />
					</a>
				</div>
			);
		}
});

// TweetText needs a tweet's text, passed in as text.
var TweetText = React.createClass({
    render: function () {
        var text = this.props.text;
        return (
            <div className="tweet-content">{text}</div>
        );
    }
});

// TweetFooter needs a tweet's URL and its created_at, though really it needs its created_at to be made readable first...
var TweetFooter = React.createClass({
    render: function () {
        var url = this.props.url;
		var created_at = this.props.created_at; // this could easily be converted here with moment.js. or i could provide it in json from server as is basically done now.
		return (
            <div className="tweet-footer">
                <a className="view-detail" target="_blank" href={url}>{created_at.toString()}</a>
            </div>
        );
    }
});

// TweetBody needs a tweet to render
var TweetBody = React.createClass({
    render: function () {
        var tweet = this.props.tweet;
        var index = this.props.index;
		var onUserDeletion = this.props.onUserDeletion;
		return (
            <div className="tweet-body">
                <TweetUser user={tweet.user} />
                <TweetText text={tweet.text} />
				<TweetFooter url={tweet.url} created_at={tweet.created_at} />
				<TweetDeleteButton index={index} onUserDeletion={onUserDeletion} />
            </div>
        );
    }
});

var HiddenTweet = React.createClass({

	handleClick: function () {
        var to_undelete = [];
		to_undelete.push(this.props.index);
		this.props.onUserUndeletion(
            to_undelete
        );
	},

	render: function () {
        return (
		    <div width="100%" height="20px">
			    <a href="#" onClick={this.handleClick}>
                    Click to show deleted tweet
                </a>
            </div>
        );
	}
});


// StoryElement needs a tweet and an index, which identifies this element of this particular Story.
// I don't think this is quite the way to use the index programmatically, but let's see what happens.
var StoryElement = React.createClass({
	render: function () {
		var deletionHandlers = this.props.deletionHandlers;
		var tweet = this.props.tweet;
		var index = this.props.index;
        if (this.props.hidden_indexes.indexOf(index) > -1) {
            return (
                <HiddenTweet index={index} onUserUndeletion={deletionHandlers.handleUserUndeletion}/>
            );
        }
        else {
		    return (
			    <div className="panel-body tweet" id={tweet.index}>
				    <TweetBody tweet={tweet} index={index} onUserDeletion={deletionHandlers.handleUserDeletion}/>
			    </div>
		    );
        }
	}
});

// StoryElementsContainer needs an array of tweets to pass one by one to StoryElement
var StoryElementsContainer = React.createClass({
	render: function () {
		var tweets = this.props.tweets;
		var output = [];
        var hidden_indexes = this.props.hidden_indexes;
		var deletionHandlers = this.props.deletionHandlers;
		tweets.forEach(function(tweet, index) {
			output.push(<StoryElement
							tweet={tweet}
							index={index}
							key={index}
							hidden_indexes={hidden_indexes}
							deletionHandlers={deletionHandlers}
						/>);
		});
		return (
			<div className="panel panel-default tweets-panel">
				{output}
			</div>
		);
}});




var App = React.createClass({



// Since the app will basically be one-page from now on, it needs to have a default state.
// We'll stay with the default state of, "you're looking at everything."
// If we switch to a particular "story", its state will be recorded here:
	getInitialState: function () {
		return ( {
			current_story: {},
			hidden_indexes: []
		} );
	},


	handleUserDeletion: function(indexes_to_hide) {
		var new_indexes = this.state.hidden_indexes;
		indexes_to_hide.forEach( function(i) { new_indexes.push(i); });
		this.setState({
			current_story: this.state.current_story,
			hidden_indexes: new_indexes
		});
	},

	handleUserUndeletion: function(indexes_to_unhide) {
		var indexes = this.state.hidden_indexes;
		indexes_to_unhide.forEach( function(i) {
			var location = indexes.indexOf(i);
			indexes.splice(location, 1);
		});
		this.setState({
			current_story: this.state.current_story,
			hidden_indexes: indexes
		});
	},




// Here's an example story definition:
//
// exampleStory = {		// this example would switch the app to displaying event 0.
//		type: "event",      <-- "event" is the only type so far; could be broken into "action", "meeting", etc
//		storyId: 0			<-- "storyId" = the id of the event (or whatever other type shows up later).
// }
	render: function() {
		var self = this;
		var deletionHandlers = {};
		// deletionHandlers.handleUserDeletion = this.handleUserDeletion;
		// deletionHandlers.handleUserUndeletion = this.handleUserUndeletion;
		var storyElements = this.props.storyElements;
		return (
			<StoryElementsContainer
				tweets={storyElements.tweets}
				hidden_indexes={this.state.hidden_indexes}
			    deletionHandlers = {_.pick(this, 'handleUserDeletion', 'handleUserUndeletion')}
			/>
		);
	}
});

React.render(<App storyElements={storyElements} />, document.body);
