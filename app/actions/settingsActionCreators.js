var Marty = require('marty');
var SettingsConstants = require('../constants/settingsConstants.js');

var SettingsActionCreators = Marty.createActionCreators({

  id: "SettingsActionCreators",

  changeSetting: function(setting_name, value) {
    this.dispatch(SettingsConstants.CHANGE_SETTING, setting_name, value);
  }
});

module.exports = SettingsActionCreators;
