'use strict'

/*global require*/
/*global _*/
/*global console */


var should = require('should');
require('./testdom')('<html><body></body></html>');

var $ = require('jquery'),
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

$.support.cors = true;
$.ajaxSettings.xhr = function() {
    return new XMLHttpRequest();
};

/*
describe('tagManager', function() {
  it('should know what tags are in the story', function() {
    tagManager.props.tags.should.eql(true)

    })
  }
} */

describe('App', function() {
  it('should load more than 200 elements in StoryElementsColumnInfinite with initial story', function () {
    var React = require('react/addons');
    var App = require('../App.jsx');
    var TestUtils = React.addons.TestUtils;
    var initial_story = require('../sample_data/initial_story.js');

    var testApp = TestUtils.renderIntoDocument(
      <App initial_story={initial_story} />
    );

    var testAppElementsContainer = TestUtils.findAllInRenderedTree(testApp, function(component) {return (component.props.className == 'StoryElementsContainer');})[0];
    testAppElementsContainer.state.elements.length.should.be.above(200);
  })
})
