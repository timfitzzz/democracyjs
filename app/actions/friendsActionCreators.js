var Marty = require('marty');
var friendsConstants = require('../constants/friendsConstants');


var friendsActionCreators = Marty.createActionCreators({

  id: "friendsActionCreators",

  requestAddFriend: function() {
    this.dispatch(friendsConstants.ADD_FRIEND_REQUESTED);
  }


});

module.exports = friendsActionCreators;
