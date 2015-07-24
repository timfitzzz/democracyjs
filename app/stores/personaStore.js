var Marty = require('marty');
var PersonaConstants = require('../constants/personaConstants.js');
var _ = require('underscore');

var PersonaStore = Marty.createStore({
  displayName: 'PersonaStore',

  handlers: {
    setCurrentPersona: PersonaConstants.SET_CURRENT_PERSONA,
    getPersonaActions: PersonaConstants.GET_PERSONA_ACTIONS,
    getAllPersonas: PersonaConstants.GET_ALL_PERSONAS,
    addPersona: PersonaConstants.ADD_PERSONA,
    getCurrentPersonaId: PersonaConstants.GET_CURRENT_PERSONA_ID
  },

  getInitialState: function() {
    return {
      current_persona_id: "Persona One",
      personas: {
        "Persona One": {
          actions: [],
          reactions: []
        }
      }
    };
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

  setCurrentPersona: function(persona_id) {
    if (this.state.personas[persona_id]) {
      var current_state = this.state;
      var new_state = current_state;
      new_state.current_persona_id = persona_id;
      this.setState(new_state);
    }
    else {
      console.log("No such persona!");
      return;
    }
  },

  getCurrentPersonaId: function() {
    return this.state.current_persona_id;
  },

  addPersona: function(new_persona_id) {
    if (!this.state.personas[new_persona_id]) {
      var current_state = this.state;
      var new_state = current_state;
      new_state.personas[new_persona_id] = { actions: [], reactions: []};
      this.setState(new_state);
    }
  }

});

module.exports = PersonaStore;
