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
            value: "NoKings!",
            type: "shortText"
          },
          backgroundcolor: {
            value: "#FFFFAA",
            type: "CSS"
          },
          description: {
            value: "Experiments in unadministration by @dicey__",
            type: "shortText"
          }
        },
        agreements: {
          optimism_threshhold: {
            value: 0.5,
            type: "percentile"
          },
          consent_threshhold: {
            value: 0.5,
            type: "percentile"
          }
        }
      }
    };
  },

  // HANDLERS

  changeSetting: function (group, setting, value) {
    if (this.state.settings[group]) {
        if(this.state.settings[group][setting]) {
          this.state.settings[group][setting].value = value;
          this.hasChanged();
        }
      else {
        console.log("Setting doesn't exist!");
        return false;
      }
    }
    else {
      console.log("Group doesn't exist!");
      return false;
    }
  },

  // QUERIES

  getAllSettings: function() {
    return this.state.settings;
  },

  getSettingGroup: function(groupname) {
    return this.state.settings[groupname];
  },

  getSetting: function(groupname, settingname) {
    return this.state.settings[groupname][settingname];
  },

  getSettingValue: function(setting_object) {
    return Object.byString(this.state.settings, this.stringifySettingArray(setting_object) + ".value");
  },

  isCurrentSetting: function(setting_object, value) {
    return(Object.byString(this.state.settings, this.stringifySettingArray(setting_object) + ".value") == value);
  },

  // HELPERS

  stringifySettingArray: function(setting_array) {
    var setting_string = "";
    _.each(setting_array, function(setting) {
      setting_string = setting_string+setting+".";
    });
    setting_string = setting_string.substr(0, setting_string.length-1);
    return setting_string;
  }



});

module.exports = SettingsStore;
