var Marty = require('marty');
var PersonaConstants = require('../constants/personaConstants.js');
var _ = require('underscore');

var PersonaStore = Marty.createStore({
  displayName: 'PersonaStore',

  handlers: {
    setActivePersona: PersonaConstants.SET_ACTIVE_PERSONA,
    addPersona: PersonaConstants.ADD_PERSONA
  },

  getInitialState: function() {
    return {
      active_persona: "Persona One",
      personas: {
        "Persona One": {
          actions: [],
          reactions: []
        }
      }
    };
  },

  //HANDLERS

  setActivePersona: function(persona_id) {
    if (this.state.personas[persona_id]) {
      var current_state = this.state;
      var new_state = current_state;
      new_state.active_persona = persona_id;
      this.setState(new_state);
    }
    else {
      console.log("No such persona!");
      return;
    }
  },

  addPersona: function(new_persona_id) {
    if (!this.state.personas[new_persona_id]) {
      var current_state = this.state;
      var new_state = current_state;
      new_state.personas[new_persona_id] = { actions: [], reactions: []};
      this.setState(new_state);
    }
  },

  getAllPersonas: function() {
    return this.state.personas;
  },

  getPersonaActions: function (persona_id) {
    if (this.state.personas[persona_id]){
      return this.state.personas[persona_id].actions;
    }
    else {
      console.log("No such persona");
      return;
    }
  },



  getActivePersona: function() {
    return this.state.active_persona;
  }



});

module.exports = PersonaStore;
