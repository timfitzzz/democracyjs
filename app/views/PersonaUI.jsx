'use strict'
/* global require */
/* global React */
/*global module */

var Marty = require('marty');
var Panel = require('react-bootstrap').Panel;
var DropdownButton = require('react-bootstrap').DropdownButton;
var MenuItem = require('react-bootstrap').MenuItem;
var _ = require('underscore');
var Button = require('react-bootstrap').Button;
var ButtonInput = require('react-bootstrap').ButtonInput;
var Input = require('react-bootstrap').Input;

var PersonaUI = React.createClass({

  displayName: "PersonaUI",

  getInitialState: function() {
    return {
      new_persona_field_value: ""
    };
  },

  onTextChange: function(e) {
    this.setState({
      new_persona_field_value: e.target.value
    });
  },

  addPersona: function() {
    var that = this;
    this.context.app.personaActionCreators.addPersona(this.state.new_persona_field_value);
  },

  changePersona: function(new_persona_id) {
    this.context.app.personaActionCreators.setActivePersona(new_persona_id);
  },

  renderPersonaAdder: function() {
    return(<form>
              <br></br>
              <Input ref="enterPersona" type="shortText" onChange={this.onTextChange} placeholder="New Persona"/>
              <ButtonInput ref="submitPersona" type="reset" onClick={this.addPersona}>Add</ButtonInput>
      </form>
    );
  },

  renderPersonaMenuItem: function(index) {
    var ref = index.replace(/\s+/g, '');
    var item = (<MenuItem ref={ref} eventKey={index} key={index}>{index}</MenuItem>);
    return item;
  },

  renderPersonaMenu: function (personas){
    var persona_menu = [];
    var that = this;
    _.forEach(personas, function(persona, index) {
      var item = that.renderPersonaMenuItem(index);
      persona_menu.push(item);
    });
    return persona_menu;
  },

	render: function() {
		var self = this;
    return (<Panel ref="panel">
              <div ref="title">Current Persona:<br/>
                <DropdownButton ref="personaSelector" title={this.props.active_persona} onSelect={this.changePersona}>
                  {this.renderPersonaMenu(this.props.personas)}
                </DropdownButton>
              </div>
              <div ref="adderContainer">
                {this.renderPersonaAdder()}
              </div>
		        </Panel>);
  }
});


module.exports = Marty.createContainer(PersonaUI, {
  listenTo: ["personaStore"],
  fetch: {
    active_persona: function() {
      return this.app.personaStore.getActivePersona();
    },
    personas: function() {
      return this.app.personaStore.getAllPersonas();
    }
  }
});
