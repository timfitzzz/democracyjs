'use strict'
/* global require */

var _ = require('underscore');
var SettingPanel = require('./SettingPanel.jsx');

var SettingsBoard = React.createClass({

  displayName: "SettingsBoard",

  renderSetting: function(setting, setting_name) {
    console.log("Rendering " + setting_name + ": " + setting);
    var panel = (<SettingPanel setting={setting} setting_name={setting_name} key={setting_name}/>);
    console.log(panel);
    return(panel);
  },

  renderSettings: function() {
    var SettingsPanels = [];
    var that = this;
    _.forEach(this.props.settings, function (setting, index) {
      SettingsPanels.push(that.renderSetting(setting, index));
    });
    console.log(SettingsPanels);
    return SettingsPanels;
  },

	render: function() {
		var self =  this;
    var settings = this.renderSettings();
		return (<div>{settings}</div>);
  }
});

module.exports = Marty.createContainer(SettingsBoard, {
  listenTo: ["settingsStore"],
  fetch: function () {
    return this.app.settingsStore.state;
    }
  }
);
