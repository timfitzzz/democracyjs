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
	render: function() {
		var self = this;
		return (
		);
	}
});
