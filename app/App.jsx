/* global require */

var React = require('react');
var _ = require('underscore');

var FourColumnGrid = require('./views/FourColumnGrid.jsx');

Object.byString = function(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
};

module.exports = React.createClass({
/*
	getInitialState: function () {
		var current_story = {};
		if (this.props.initial_story) {
				current_story = this.props.initial_story;
		}
		return ( {
			tagnames: require('./sample_data/sample_tagnames.js'), // need to port  to server
			highlights: require('./sample_data/sample_highlights.js'),  // need to port  to serverr
			current_story: current_story,
			hidden_indexes: []
		} );
	},


	handleUserDeletion: function(indexes_to_hide) {
		var new_indexes = this.state.hidden_indexes;
		indexes_to_hide.forEach( function(i) { new_indexes.push(i); });
		this.setState({
			current_story: this.state.current_story,
			hidden_indexes: new_indexes
		});
	},

	handleUserUndeletion: function(indexes_to_unhide) {
		var indexes = this.state.hidden_indexes;
		indexes_to_unhide.forEach( function(i) {
			var location = indexes.indexOf(i);
			indexes.splice(location, 1);
		});
		var s = {
			current_story: this.state.current_story,
			hidden_indexes: indexes
		};
		this.setState(s);
		return s;
	},

	handleStoryChange: function(new_story) {
		this.setState({
			current_story: new_story,
			hidden_indexes: this.state.hidden_indexes
		});
	}, */

	render: function() {
		var self = this;
		return (
							<FourColumnGrid/>
		);
	}
});
