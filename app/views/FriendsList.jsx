'use strict'
/* global require */
var _ = require('underscore');
var Marty = require('marty');
var Button = require('react-bootstrap').Button;

var FriendsList = React.createClass({

  displayName: "FriendsList",

  renderFriend: function(friend, index) {
      return(<li key={index} ref={"friend" + index}>{friend}</li>);
  },

  requestNewFriend: function() {
      this.app.friendsActionCreators.requestAddFriend();
  },

	render: function() {
    var that = this;

    return (<div>
            <h2 ref="title">
              Friends!
            </h2>
            <div className="foo" refCollection="friendlist">
              <ol>
                {this.props.friends.map(function(friend, index) {
                    return that.renderFriend(friend, index)})
                  }
              </ol>
            </div>
            <Button ref="addFriendButton" onClick={this.requestNewFriend}>Add Friend</Button>
          </div>);
  }

});


module.exports = Marty.createContainer(FriendsList, {
  listenTo: ['friendsStore'],
  fetch: {
    friends: function() {
      return this.app.friendsStore.getFriends();
    }
  }
});
