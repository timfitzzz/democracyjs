'use strict'
/* global require */

var Grid = require('react-bootstrap').Grid,
    Row = require('react-bootstrap').Row,
    Col = require('react-bootstrap').Col;
var Results = require('./Results.jsx'),
    SettingsBoard = require('./SettingsBoard.jsx'),
    ColThree = require('./ColumnThree.jsx'),
    PersonaUI = require('./PersonaUI.jsx');

module.exports = React.createClass({

  displayName: "FourColumnGrid",

	render: function() {
		var self = this;
		return (
      <Grid>
        <Row className='dolo-rowlo'>
          <Col md={3}>
            <Results

            />
          </Col>
          <Col md={3}>
            <SettingsBoard

            />
          </Col>
          <Col md={3}>
            <ColThree

            />
          </Col>
          <Col md={3}>
            <PersonaUI

            />
          </Col>
        </Row>
      </Grid>
		);
	}
});
