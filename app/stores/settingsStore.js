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
        pageMeta: {
          title:  {
            value: "This site is great!",
            type: "shortText"
          },
          backgroundcolor: {
            value: "#000000",
            type: "CSS"
          }
        }
      }
    };
  },

  getAllSettings: function() {
    return this.state.settings;
  },

  changeSetting: function (group, setting, value) {
    if (this.state.settings[group][setting]) {
      this.state.settings[group][setting].value = value;
      this.hasChanged();
    }
    else {
      console.log("Setting doesn't exist");
      return;
    }
  },

  getSettingGroup: function(groupname) {
    return this.state.settings[groupname];
  },

  getSetting: function(groupname, settingname) {
    return this.state.settings[groupname][settingname];
  }

});

module.exports = SettingsStore;
