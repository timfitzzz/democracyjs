var _ = require('underscore');
require('marty-test-utils');
var chai = require('chai');
var should = chai.should();

var Application = require('../../App.js');
var createApplication = require('marty/test-utils').createApplication;
var hasDispatched = require('marty/test-utils').hasDispatched;

var friendsConstants = require('../../constants/friendsConstants');

// github: martyjs/marty-test-examples

describe('friendActions', function() {
  var app;

  beforeEach( function() {
      app = createApplication(Application, {
        include: ['friendsActionCreators']
        // also could stub, set spies, and could set state
      });
  });

  describe('addFriend', function() {

    it('dispatches AddFriend to stores', function() {
        app.friendsActionCreators.addFriend();
        hasDispatched(app, friendsConstants.ADD_FRIEND).should.eql(true);
    });

  });

});
