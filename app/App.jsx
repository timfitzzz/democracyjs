/* global require */

var React = require('react');
var _ = require('underscore');

var FourColumnGrid = require('./views/FourColumnGrid.jsx');
Object.byString = require('./helpers/object-bystring.js');


module.exports = React.createClass({

	render: function() {
		var self = this;
		return (
      <FourColumnGrid ></FourColumnGrid>
		);
	}
});
