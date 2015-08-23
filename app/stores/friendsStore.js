var Marty = require('marty');
var friendsConstants = require('../constants/friendsConstants.js');
var _ = require('underscore');

var FriendsStore = Marty.createStore({

  displayName: "friendsStore",

  handlers: {
    addFriend: friendsConstants.ADD_FRIEND_REQUESTED
  },

  getInitialState: function() {
    this.setState({
      friends: []
    });
  },


  addFriend: function() {
    this.setState({
      friends: this.state.friends.concat(["Friend " + (this.state.friends.length+1)])
    });
  }

});

module.exports = FriendsStore;
