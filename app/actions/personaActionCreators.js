var Marty = require('marty');
var PersonaConstants = require('../constants/personaConstants.js');

var PersonaActionCreators = Marty.createActionCreators({

  id: "PersonaActionCreators",

  setCurrentPersona: function(persona_id) {
    this.dispatch(PersonaConstants.SET_CURRENT_PERSONA, persona_id);
  },

  getPersonaActions: function(persona_id) {
    this.dispatch(PersonaConstants.GET_PERSONA_ACTIONS, persona_id);
  },

  getAllPersonas: function() {
    this.dispatch(PersonaConstants.GET_ALL_PERSONAS);
  },

  addPersona: function(new_persona_id) {
    this.dispatch(PersonaConstants.ADD_PERSONA, new_persona_id);
  },

  getCurrentPersonaId: function() {
    this.dispatch(PersonaConstants.GET_CURRENT_PERSONA);
  }
});

module.exports = PersonaActionCreators;
