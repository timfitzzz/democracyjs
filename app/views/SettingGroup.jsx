'use strict'
/* global require */
var Panel = require('react-bootstrap').Panel;
var _ = require('underscore');

var SettingPanel = require('./SettingPanel.jsx');

var SettingGroup = React.createClass({

  displayName: "SettingGroup",

  renderPanels: function(group) {
    var that = this;
    var groupOfPanels = [];
    _.forEach(group, function(setting, index){
      groupOfPanels.push(<SettingPanel setting={setting} setting_name={index} groupname={that.props.groupname} key={index}/>)
    });
    return groupOfPanels;
  },

	render: function() {
		var self =  this;
    var group = this.props.group;
    var groupname = this.props.groupname;
		return (<Panel>
              <div>{groupname}</div>
              <Panel>{this.renderPanels(group)}</Panel>
		        </Panel>);
  }
});

module.exports = SettingGroup;
