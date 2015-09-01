var _ = require('underscore');
require('marty-test-utils');
var chai = require('chai');
var should = chai.should;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var Application = require('../../App.js');
var createApplication = require('marty/test-utils').createApplication;
var dispatch = require('marty/test-utils').dispatch;

var PersonaUI = require('../../views/PersonaUI.jsx');
var testTree = require('react-test-tree');
var PersonaConstants = require('../../constants/personaConstants');

describe('PersonaUI', function() {
  var app, listener;


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

    var personaQueryStubs = {
      getAllPersonas: sinon.stub(),
      getPersonaActions: sinon.stub(),
      getActivePersona: sinon.stub()
    };

    var personaActionCreatorsSpies = {
      setActivePersona: sinon.spy(),
      addPersona: sinon.spy()
    };

    app = createApplication(Application, {
      include: ['personaStore'],
      stub: {
          // personaStore: personaQueryStubs,
          personaActionCreators:  personaActionCreatorsSpies
      }
    });

    app.personaStore.state = states[state];

    var component = propTree(app, states[state].personas, states[state].active_persona);

    return {
      component: component,
      app: app
    };

  };

  var propTree = function(app, personas, active_persona) {
    return testTree(<PersonaUI.InnerComponent personas={personas} active_persona={active_persona}/>, {context: {app: app}});
  };

  var tree = function(app, personas, active_persona) {
    return testTree(<PersonaUI />, {context: {app: app}});
  };

  describe('CONTENTS', function() {
    var component = setup("three_persona_state").component;

    it('title div begins Current Persona:', function() {
      component.title.innerText.trim().substr(0, 16).should.eql("Current Persona:");
    });

    it('contains persona-selector', function() {
      component.personaSelector.should.exist;
    });

    it('contains a ref for each persona', function() {
      for (var persona in app.personaStore.state.personas) {
        var persona = persona.replace(/\s+/g, '');
        component[persona].should.exist;
      };
    });

    it('contains enterPersona input', function() {
      component.enterPersona.should.exist;
    });

    it('contains persona_submit button', function() {
      component.submitPersona.should.exist;
    })
  });

  describe('INTERACTIVITY', function() {
    var instance = setup("three_persona_state");
    var app = instance.app;
    var component = instance.component;

    describe('submitPersona', function() {

      it('should call addPersona when clicked', function() {
          component.submitPersona.click();
          app.personaActionCreators.addPersona.should.have.been.calledOnce;
      });

    });

    describe('personaSelector', function() {

      it('should call changePersona when persona is selected', function() {
          component.PersonaTwo.simulate.select();
          app.personaActionCreators.setActivePersona.should.have.been.calledOnce;
      });

    });

    describe('enterPersona', function() {

      it('should call onTextChange to change new_persona_field_value with new text when text is changed', function() {
        component.enterPersona.value = 'a';
        component.enterPersona.simulate.change();
        component.state.new_persona_field_value.should.eql('a');
      });
    });
  });

  describe('REACTIVITY', function(){

    it('should receive new personas when personaStore.state.personas changes', function() {
      var instance = setup("default_state");
      var app = instance.app;
      var component = instance.component;

      component.getProp("personas").should.eql({
        "Persona One": {
          actions:[],
          reactions: []
        }
      });
      app.personaStore.addPersona("Persona Two");

      component.getProp("personas").should.eql({
        "Persona One": {
          actions:[],
          reactions: []
        },
        "Persona Two": {
          actions: [],
          reactions: []
        }
      });
    });

    it('should receive new active_persona when personaStore.state.active_persona changes', function() {
      var instance = setup("default_state");
      var app = instance.app;
      var component = instance.component;

      component.getProp("active_persona").should.eql("Persona One");
      app.personaStore.addPersona("Persona Two");
      app.personaStore.setActivePersona("Persona Two");

      var component2 = tree(app);
      component2.innerComponent.getProp("active_persona").should.eql("Persona Two");
    });


  });

});
