// This is the structure I am trying to model with React.js; the same as current builds of twinput-sandbox.
// A "story" is any view of elements, which for now of course can only be tweets. Displaying other elements later will be simple with React.
//

// JSLint exceptions...
/*global require*/
/*global _*/
/*global document*/

/*
	App

		NavBar

		StoryViews/DayOfAction

			StoryViews/StoryComponents/StoryHeader
				StoryViews/StoryComponents/StoryHeaderComponents/StoryTitlePanel
				StoryViews/StoryComponents/StoryHeaderComponents/StoryDetailsPanel
				StoryViews/StoryComponents/StoryHeaderComponents/StorySwitcherPanel

			StoryViews/StoryComponents/StoryElementsColumnPaged
				StoryViews/StoryComponents/StoryElementsColumnComponents/StoryElementsPager
				StoryViews/StoryComponents/StoryElementsColumnComponents/StoryElementsContainer
					StoryViews/StoryComponents/StoryElementsColumnComponents/StoryElements/SingleTweet
						StoryViews/StoryComponents/StoryElementsColumnComponents/StoryElements/TweetComponents/TweetBody
							StoryViews/StoryComponents/StoryElementsColumnComponents/StoryElements/TweetComponents/TweetBodyComponents/TweetUser
							StoryViews/StoryComponents/StoryElementsColumnComponents/StoryElements/TweetComponents/TweetBodyComponents/TweetText
							StoryViews/StoryComponents/StoryElementsColumnComponents/StoryElements/TweetComponents/TweetBodyComponents/TweetDeleteButton
							StoryViews/StoryComponents/StoryElementsColumnComponents/StoryElements/TweetComponents/TweetBodyComponents/TweetFooter

*/

'use strict'

var React = require('react');
var _ = require('underscore');

var NavBar = require('./NavBar.jsx');
var StoryView = require('./StoryView.jsx');

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

var initial_story = {
				"id": 0,
				"name": "#N17",
				"type": "Day of Action",
				"start_day_en": "November 17, 2011",
				"start_date": "2011-11-17 5:00a",
				"end_date": "2011-11-18 5:00a",
				"description": "Lorem ipsum whatsis",
				"location": "NYC"
};




var App = React.createClass({



// Since the app will basically be one-page from now on, it needs to have a default state.
// We'll stay with the default state of, "you're looking at everything."
// If we switch to a particular "story", its state will be recorded here:
	getInitialState: function () {
		var current_story = {}
		if (this.props.initial_story) {
				current_story = this.props.initial_story;
		}
		return ( {
			current_story: current_story,
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

	handleStoryChange: function(new_story) {
		this.setState({
			current_story: new_story,
			hidden_indexes: this.state.hidden_indexes
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
		return ( <div>
							<NavBar site_title="@LibertySqGA Archive"/>
							<StoryView
								story={this.state.current_story}
								story_tweets={storyElements.tweets}
								hidden_indexes={this.state.hidden_indexes}
			    			deletionHandlers = {_.pick(this, 'handleUserDeletion', 'handleUserUndeletion')}
							/>
						</div>
		);
	}
});

React.render(<App storyElements={storyElements} initial_story={initial_story} />, document.getElementById('content'));
