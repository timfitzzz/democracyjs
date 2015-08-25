'use strict'
/* global require */
var Panel = require('react-bootstrap').Panel;

var SettingPanel = require('./SettingPanel.jsx');

var SettingChangeProposer = React.createClass({
  contextTypes: Marty.contextTypes,

  displayName: "SettingChangeProposer",

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
                        <button onClick={this.submitProposal}>Propose Change</button>
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

  submitProposal: function (e) {
    var self = this;
    var proposer = this.context.app.personaStore.state.active_persona;
    var handler = this.types[this.props.type].handler;
    var change = this.state.field_value;
    var setting_name = [this.props.groupname, this.props.setting_name];
    this.context.app.proposalActionCreators.submitProposal(
        { proposed_by: proposer,
          setting: setting_name,
          new_value: change }
    );
  }
});

module.exports = SettingChangeProposer;
