'use strict'
/* global require */
var Panel = require('react-bootstrap').Panel;

var SettingPanel = require('./SettingPanel.jsx');
var SettingChanger = require('./SettingChanger.jsx');

module.exports = React.createClass({

  displayName: "SettingPanel",

	render: function() {
		var self =  this;
		return (<Panel>
              <div>Setting: {this.props.setting_name}</div>
              <div>Value: {this.props.setting.value}</div>
              <SettingChanger setting={this.props.setting_name}
                              type={this.props.setting.type}
                              process={this.props.setting.process}

              />
		        </Panel>);
  }
});
