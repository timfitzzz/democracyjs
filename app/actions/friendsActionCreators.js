var Marty = require('marty');
var friendsConstants = require('../constants/friendsConstants');


var friendsActionCreators = Marty.createActionCreators({

  id: "friendsActionCreators",

  addFriend: function() {
    this.dispatch(friendsConstants.ADD_FRIEND);
  }


});

module.exports = friendsActionCreators;
