'use strict'
/* global require */
var Panel = require('react-bootstrap').Panel;
var Marty = require('marty');


var SettingPanel = require('./SettingPanel.jsx');

var SettingChanger = React.createClass({
  contextTypes: Marty.contextTypes,

  displayName: "SettingChanger",

  types: require('../settingTypes/index.js'),

  getInitialState: function() {
    var default_value = this.props.default_value;
    return {
      field_value: default_value
    }
  },

	render: function() {
    var default_value = this.props.default_value;
		var self =  this;
    if (this.types[this.props.type]) {
      var changer = (<div><input type={this.types[this.props.type].field_type} onChange={this.onChange} placeholder={default_value}/>
                        <button onClick={this.submitChange}>Change</button>
                      </div>);
		return changer;
    }
    else {
      return (<div>invalid type</div>)
    }
  },

  onChange: function(e) {
    this.setState({
      field_value: e.target.value
    })
  },

  submitChange: function (e) {
    var self = this;
    var handler = this.types[this.props.type].handler;
    var change = this.state.field_value;
    var setting_name = this.props.setting_name;
    this.context.app.settingsActionCreators[handler](this.props.groupname, setting_name, change);
  }
});

module.exports = SettingChanger;
