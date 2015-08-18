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
            value: "#FFFFAA",
            type: "CSS"
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
  },

  getSettingValue: function(setting_object) {
    return Object.byString(this.state.settings, this.stringifySettingArray(setting_object) + ".value")
  },

  stringifySettingArray: function(setting_array) {
    var setting_string = "";
    _.each(setting_array, function(setting) {
      setting_string = setting_string+setting+".";
    });
    setting_string = setting_string.substr(0, setting_string.length-1);
    console.log(setting_string);
    return setting_string;
  },

  isCurrentSetting: function(setting_object, value) {
    var setting_path = "";
    for (level in setting_object) {
      setting_path.push(level + ".");
    };
    setting_path = setting_path.substr(0, setting_path.length-1);
    return(this.state.settings[setting_path] == value);
  }

});

module.exports = SettingsStore;
