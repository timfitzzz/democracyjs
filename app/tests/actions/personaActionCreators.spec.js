var _ = require('underscore');
require('marty-test-utils');
var chai = require('chai');
var should = chai.should();

var Application = require('../../App.js');
var createApplication = require('marty/test-utils').createApplication;
var hasDispatched = require('marty/test-utils').hasDispatched;

var PersonaConstants = require('../../constants/personaConstants');

describe('personaActions', function() {
  var app;

  beforeEach( function() {
      app = createApplication(Application, {
        include: ['personaActionCreators']
      });
  });

  describe('addPersona', function() {

    it('dispatches ADD_PERSONA to stores with provided new_persona_id', function(){

      app.personaActionCreators.addPersona("test");
      hasDispatched(app, PersonaConstants.ADD_PERSONA, "test").should.eql(true);

    });

  });

  describe('setActivePersona', function() {

    it('dispatches SET_ACTIVE_PERSONA to stores with provided persona_id', function() {

      app.personaActionCreators.setActivePersona("foo");
      hasDispatched(app, PersonaConstants.SET_ACTIVE_PERSONA, "foo").should.eql(true);

    });

  });




});
