var Marty = require('marty');
var PersonaConstants = require('../constants/personaConstants.js');

var personaActionCreators = Marty.createActionCreators({

  id: "personaActionCreators",

  setActivePersona: function(persona_id) {
    this.dispatch(PersonaConstants.SET_ACTIVE_PERSONA, persona_id);
  },

  addPersona: function(new_persona_id) {
    this.dispatch(PersonaConstants.ADD_PERSONA, new_persona_id);
  }

});

module.exports = personaActionCreators;
