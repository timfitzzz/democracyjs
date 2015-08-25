'use strict'
/* global require */

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
    }
  },

  onTextChange: function(e) {
    this.setState({
      new_persona_field_value: e.target.value
    })
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
              <Input type="shortText" onChange={this.onTextChange} placeholder="New Persona"/>
              <ButtonInput type="reset" onClick={this.addPersona}>Add</ButtonInput>
      </form>
    )
  },

  renderPersonaMenuItem: function(index) {
    return (<MenuItem eventKey={index} key={index}>{index}</MenuItem>)
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
    var menu_items = this.renderPersonaMenu(this.props.personas);
		return (<Panel>
              <div>Current Persona:<br/>
                <DropdownButton title={this.props.current_persona} onSelect={this.changePersona}>
                  {menu_items}
                </DropdownButton>
              </div>
              <div>
                {this.renderPersonaAdder()}
              </div>
		        </Panel>);
  }
});


module.exports = Marty.createContainer(PersonaUI, {
  listenTo: ["personaStore"],
  fetch: {
    current_persona: function() {
      return this.app.personaStore.getActivePersona();
    },
    personas: function() {
      return this.app.personaStore.getAllPersonas();
    }
  }
});
