var _ = require('underscore');
require('marty-test-utils');
var chai = require('chai');
var should = chai.should();
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var Application = require('../../App.js');
var createApplication = require('marty/test-utils').createApplication;
var dispatch = require('marty/test-utils').dispatch;

var personaConstants = require('../../constants/personaConstants.js');

describe('personaStore', function() {
  var app, listener;

  var persona_object_model = { actions:[],reactions:[]};

  var setup = function(state) {

     var states = {

       default_state: {
         active_persona: "Persona One",
         personas: {
           "Persona One": {
             actions:[],
             reactions: []
           }
         }
       },
       two_persona_state: {
         active_persona: "Persona One",
         personas: {
           "Persona One": {
             actions: [],
             reactions: []
           },
           "Persona Two": {
             actions: [],
             reactions: []
           }
         }
       },
       three_persona_state: {
         active_persona: "Persona One",
         personas: {
           "Persona One": {
             actions: [],
             reactions: []
           },
           "Persona Two": {
             actions: [],
             reactions: []
           },
           "Persona Three": {
             actions: [],
             reactions: []
           }
         }
       },
     };

      app = createApplication(Application, {
        include: ['personaStore']
        // also could stub, set spies, and could set state
      });
      app.personaStore.state = states[state];
      listener = sinon.spy();
      app.personaStore.addChangeListener(listener);
  };

  describe('HANDLERS', function() {

    describe('setActivePersona', function() {

      it('responds to SET_ACTIVE_PERSONA from dispatcher w/ provided id', function() {
        setup("default_state");
        var setActivePersona = sinon.spy(app.personaStore, "setActivePersona");
        dispatch(app, personaConstants.SET_ACTIVE_PERSONA, "Persona One");
        setActivePersona.should.have.been.calledWith("Persona One");
      });

      it('sets state.active_persona to provided id', function(){
        setup("two_persona_state");
        app.personaStore.setActivePersona("Persona Two");
        app.personaStore.state.active_persona.should.eql("Persona Two");
      });

    });

    describe('addPersona', function() {

      it('responds to ADD_PERSONA from dispatcher w/ provided id', function() {
        setup("default_state");
        var addPersona = sinon.spy(app.personaStore, "addPersona");
        dispatch(app, personaConstants.ADD_PERSONA, "Persona Two");
        addPersona.should.have.been.calledWith("Persona Two");
      });

      it('sets any provided string to a new persona id and assigns it to expected object', function(){
        setup("default_state");
        var persona_id = Math.random().toString(36).substr(2, 7);
        app.personaStore.addPersona(persona_id);

        //build expected state from generated id
        var desired_state_construction = {
          active_persona: "Persona One",
          personas: {
            "Persona One": {
              actions: [],
              reactions: [],
            }
          }
        };
        desired_state_construction.personas[persona_id] = persona_object_model;
        var desired_state = desired_state_construction;

        //test state
        app.personaStore.state.should.eql(desired_state);
      });
    });

  });

  describe('QUERIES', function() {

    describe('getAllPersonas', function() {

      it('returns all personas in state', function(){
        setup("three_persona_state");
        app.personaStore.getAllPersonas().should.eql({
          "Persona One": {
            actions: [],
            reactions: []
          },
          "Persona Two": {
            actions: [],
            reactions: []
          },
          "Persona Three": {
            actions: [],
            reactions: []
          }
        });
      });
    });

    describe('getPersonaActions', function() {


      it('returns array of actions in state by given persona id', function() {
        setup("three_persona_state");
        app.personaStore.getPersonaActions("Persona Two").should.eql([]);
      });
    });

    describe('getActivePersona', function() {

      it('returns the active persona id', function() {
        setup("three_persona_state");
        app.personaStore.setActivePersona("Persona Two");
        app.personaStore.getActivePersona().should.eql("Persona Two");
      });

    });
  });
});
