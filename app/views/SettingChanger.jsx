'use strict'
/* global require */
var Panel = require('react-bootstrap').Panel;

var SettingPanel = require('./SettingPanel.jsx');
var SettingChanger = require('./SettingChanger.jsx');

module.exports = React.createClass({
  contextTypes: Marty.contextTypes,

  displayName: "SettingChanger",

  types: require('../settingTypes/index.js'),

	render: function() {
		var self =  this;
    if (this.types[this.props.type]) {
      var changer = (<input type={this.types[this.props.type].field_type}
                     onChange={this.submitChange}
                     value={""}
              />);
        console.log(changer);
		return changer;
    }
    else {
      return (<div>invalid type</div>)
    }
  },

  submitChange: function (e) {
    var handler = this.types[this.props.type].handler;
    console.log(this.context.app.settingsActionCreators.updateSetting)
    var handlerFunction = this.context.app.settingsActionCreators[handler];
    console.log(handlerFunction);
    handlerFunction(this.props.setting_name, e.target.value);
  }
});
