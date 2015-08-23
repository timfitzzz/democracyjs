var _ = require('lodash');
require('marty-test-utils');
var chai = require('chai');
var should = chai.should();
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var Application = require('../../App.js');
var createApplication = require('marty/test-utils').createApplication;
var dispatch = require('marty/test-utils').dispatch;

var friendsConstants = require('../../constants/friendsConstants');

// github: martyjs/marty-test-examples

describe('friendsStore', function() {
  var app, listener;

  var setup = function(state) {

     var states = {
       empty_state: {friends: []},
       one_friend_state: {friends: ["Friend 1"]},
       two_friend_state: {friends: ["Friend 1", "Friend 2"]}
     };

      app = createApplication(Application, {
        include: ['friendsStore']
        // also could stub, set spies, and could set state
      });
      app.friendsStore.state = states[state];
      listener = sinon.spy();
      app.friendsStore.addChangeListener(listener);
  };

  describe('HANDLERS', function() {

    describe('addFriend', function() {

      it('runs in response to ADD_FRIEND_REQUESTED from dispatcher', function() {
        setup("empty_state");
        var addFriend = sinon.spy(app.friendsStore, "addFriend");
        dispatch(app, friendsConstants.ADD_FRIEND_REQUESTED);
        addFriend.should.have.been.calledOnce;
        addFriend.restore;
      });

      it('adds friend if state is empty', function() {
        setup("empty_state");
        app.friendsStore.addFriend();
        app.friendsStore.state.should.eql({friends:["Friend 1"]});
      });

      it('adds friend if state has one friend', function() {
        setup("one_friend_state");
        app.friendsStore.addFriend();
        app.friendsStore.state.should.eql({friends:["Friend 1", "Friend 2"]});
      });

      it('adds friend if state has two friends', function() {
        setup("two_friend_state");
        app.friendsStore.addFriend();
        app.friendsStore.state.should.eql({friends:["Friend 1", "Friend 2", "Friend 3"]});
      });

      it('tells listening views that the friendsStore has changed', function() {
        setup("empty_state");
        app.friendsStore.addFriend();
        listener.should.have.been.calledWith({friends: ["Friend 1"]});
      });

    });

  });

  describe('GETTERS', function() {

    describe('getFriends', function() {

      it('returns current state of friendsStore', function() {
        setup("one_friend_state");
        app.friendsStore.getFriends().should.eql(["Friend 1"]);
      });

    });


  });


});
