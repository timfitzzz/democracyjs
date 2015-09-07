'use strict'
/* global require */
/* global React */

var _ = require('underscore');
var Marty = require('marty');
var SettingPanel = require('./SettingPanel.jsx');
var SettingGroup = require('./SettingGroup.jsx');


var SettingsBoard = React.createClass({

  displayName: "SettingsBoard",


  renderSettingGroups: function() {
    var SettingGroups = [];
    var that = this;
    _.forEach(this.props.settings, function(group, index) {
      SettingGroups.push(<SettingGroup ref={index + "Group"} key={index} group={group} groupname={index} />);
    });
    return SettingGroups;
  },


	render: function() {
		var self =  this;
    var settings = this.renderSettingGroups();
		return (<div>{settings}</div>);
  }
});

module.exports = Marty.createContainer(SettingsBoard, {
  listenTo: ["settingsStore"],
  fetch: {
    settings: function () {
      return this.app.settingsStore.getAllSettings();
    }
  }
});
