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

var FriendsList = require('../../views/FriendsList.jsx');
var testTree = require('react-test-tree');

// github: martyjs/marty-test-examples

describe('FriendsList', function() {
  var app, listener;


  var setup = function(state) {

     var states = {
       empty_state: {friends: []},
       one_friend_state: {friends: ["Friend 1"]},
       two_friend_state: {friends: ["Friend 1", "Friend 2"]}
     };

    var friendsStubs = {
       getFriends: sinon.stub()
    };

    var friendsActionCreatorsSpies = {
      addFriend: sinon.spy()
    };

    app = createApplication(Application, {
      include: ['friendsStore'],
      stub: {
          // friendsStore: friendsStubs,
          friendsActionCreators:  friendsActionCreatorsSpies
      }
        // also could stub, set spies, and could set state
    });

    app.friendsStore.state = states[state];

    var component = propTree(app, states[state].friends);

    return {
      component: component,
      app: app
    };
  };

  var propTree = function(app, friends) {
    return testTree(<FriendsList.InnerComponent friends={friends}/>, {context: {app: app}});
  };

  var tree = function(app) {
    return testTree(<FriendsList />, {context: {app: app}});
  };

  describe('contents', function() {
    var component = setup("one_friend_state").component;

    it('should be titled Friends!', function() {
      component.title.innerText.trim().should.eql("Friends!");
    });

    it('should list friends from props', function() {
      component.getProp('friends').should.eql(["Friend 1"]);
      component.friend0.should.exist;
    });

    it('should have an add button', function() {
      component.addFriendButton.should.exist;
      component.addFriendButton.innerText.trim().should.eql("Add Friend");
    });

  });

  describe('interactivity', function() {
    var instance = setup("one_friend_state");
    var app = instance.app;
    var component = instance.component;

    describe('addFriendButton', function() {

      it('should call addFriend when clicked', function() {
        component.addFriendButton.click();
        app.friendsActionCreators.addFriend.should.have.been.calledOnce;
      });

    });
  });

  describe('reactivity', function() {
    var instance = setup("one_friend_state");
    var app = instance.app;
    var component = instance.component;


    it('should receive new props when friendsStore.state changes', function() {
      component.getProp("friends").should.eql(["Friend 1"]);

      app.friendsStore.addFriend();
      var component2 = tree(app);
      component2.innerComponent.getProp("friends").should.eql(["Friend 1", "Friend 2"]);

      app.friendsStore.addFriend();
      var component3 = tree(app);
      component3.innerComponent.getProp("friends").should.eql(["Friend 1", "Friend 2", "Friend 3"]);
    });

  });


});
