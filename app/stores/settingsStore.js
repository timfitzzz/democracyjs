var Marty = require('marty');
var SettingsConstants = require('../constants/settingsConstants.js');
var _ = require('underscore');

var SettingsStore = Marty.createStore({
  displayName: 'SettingsStore',

  handlers: {
    changeSetting: SettingsConstants.CHANGE_SETTING,
  },

  getInitialState: function() {
    return {
      settings: {
        title:  {
          value: "This site is great!",
          type: "shortText"
        },
        backgroundcolor: {
          value: "#000000",
          type: "CSS"
        }
      }
    };
  },

  changeSetting: function (setting, value) {
    if (this.state.settings[setting]) {
      this.state.settings[setting].value = value;
    }
    else {
      return;
    }
  },

});

module.exports = SettingsStore;
