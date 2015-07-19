'use strict'

/*global require*/
/*global _*/
/*global console */
/*global it */


var should = require('should');
require('./testdom')('<html><body></body></html>');

var $ = require('jquery'),
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

$.support.cors = true;
$.ajaxSettings.xhr = function() {
    return new XMLHttpRequest();
};

var sample_highlight = require('./SingleTweetTestData/sample_highlight.js');
var sample_tweet = require('./SingleTweetTestData/sample_tweet.js');
var sample_tagnames = require('./SingleTweetTestData/sample_tagnames.js');


describe('SingleTweet', function(){
  // These commented-out tests are broken but the remaining test supercedes them.
/*
  it('Should have props.highlights=sampleHighlight when highlights=sampleHighlight', function () {
    var React = require('react/addons');
    var SingleTweet = require('../StoryViews/StoryComponents/StoryElementsColumnComponents/StoryElements/SingleTweet.jsx');
    var TestUtils = React.addons.TestUtils;
    var TweetElement = TestUtils.renderIntoDocument(
      <SingleTweet tweet={sample_tweet}
                   hidden_indexes={[]}
                   index={1}
                   highlights={sample_highlight}
                   deletionHandlers={{handleUserDeletion: function() {return true}}}/>
    );
    TweetElement.props.highlights.should.eql(sample_highlight);
  });

  it('s getColorFromTag() function should be able to get a color for each tag from props.tagnames',
      function () {
        var React = require('react/addons');
        var SingleTweet = require('../StoryViews/StoryComponents/StoryElementsColumnComponents/StoryElements/SingleTweet.jsx');
        var TestUtils = React.addons.TestUtils;
        var TweetElement = TestUtils.renderIntoDocument(
          <SingleTweet tweet={sample_tweet}
                       hidden_indexes={[]}
                       index={1}
                       highlights={sample_highlight}
                       deletionHandlers={{handleUserDeletion: function() {return true}}}
                       tagnames={sample_tagnames} />
        );
        TweetElement.getColorFromTag(sample_highlight[0].tag).should.eql("yellow");
  });

  it('s highlightTextSection() function should return tweet.text with words highlighted for a highlight',
    function () {
      var React = require('react/addons');
      var SingleTweet = require('../StoryViews/StoryComponents/StoryElementsColumnComponents/StoryElements/SingleTweet.jsx');
      var TestUtils = React.addons.TestUtils;
      var TweetElement = TestUtils.renderIntoDocument(
        <SingleTweet tweet={sample_tweet}
                     hidden_indexes={[]}
                     index={1}
                     highlights={sample_highlight}
                     deletionHandlers={{handleUserDeletion: function() {return true}}}
                     tagnames={sample_tagnames} />
      );
      TweetElement.highlightTextSection(sample_tweet.text, {
        text: "taken Pine and William.",
        tag: "blockade"
      }).should.eql("Now we've <span style='background-color: yellow'>taken Pine and William.</span> Quick mic check about what to do next - trying to block all entrances to Wall #OWS http://t.co/zAnuJqHK");
  });

  it('s applyHighlights() function should return tweet.text with all highlights',
    function () {
      var React = require('react/addons');
      var SingleTweet = require('../StoryViews/StoryComponents/StoryElementsColumnComponents/StoryElements/SingleTweet.jsx');
      var TestUtils = React.addons.TestUtils;
      var TweetElement = TestUtils.renderIntoDocument(
        <SingleTweet tweet={sample_tweet}
                     hidden_indexes={[]}
                     index={1}
                     highlights={sample_highlight}
                     deletionHandlers={{handleUserDeletion: function() {return true}}}
                     tagnames={sample_tagnames} />
      );
      TweetElement.applyHighlights();
      TweetElement.props.tweet.text.should.eql("Now we've <span style='background-color: yellow'>taken Pine and William.</span> Quick <span style='background-color: green'>mic check about what to do next</span> - <span style='background-color: blue'>trying to block all entrances to Wall</span> #OWS http://t.co/zAnuJqHK")
    });

*/
  it('should apply highlights when rendered',
    function () {
      var React = require('react/addons');
      var SingleTweet = require('../StoryViews/StoryComponents/StoryElementsColumnComponents/StoryElements/SingleTweet.jsx');
      var TestUtils = React.addons.TestUtils;
      var TweetElement = TestUtils.renderIntoDocument(
        <SingleTweet tweet={sample_tweet}
                     hidden_indexes={[]}
                     index={1}
                     highlights={sample_highlight}
                     deletionHandlers={{handleUserDeletion: function() {return true}}}
                     tagnames={sample_tagnames} />
      );
      TweetElement.props.tweet.text.should.eql("Now we've <span style='background-color: yellow'>taken Pine and William.</span> Quick <span style='background-color: green'>mic check about what to do next</span> - <span style='background-color: blue'>trying to block all entrances to Wall</span> #OWS http://t.co/zAnuJqHK")
  })
});
