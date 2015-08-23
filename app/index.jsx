'use strict'

// JSLint exceptions...
/*global require*/
/*global document*/
/*global window*/

var React = require('react');
var Marty = require('marty');
var _ = require('underscore');

window.React = React; // For React Developer Tools
window.Marty = Marty; // For Marty Developer Tools

var Application = require('./App.js');
var ApplicationContainer = Marty.ApplicationContainer;

var app = new Application();

// require React App
var App = require('./App.jsx');

React.render((<ApplicationContainer app={app}>
								<App/>
							</ApplicationContainer>),
							document.getElementById('content'));
