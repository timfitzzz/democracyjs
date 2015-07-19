var Marty = require('marty');
var DistributionConstants = require('../constants/elementsConstants.js');
var _ = require('underscore');

var DistributionStore = Marty.createStore({
  displayName: 'DistributionStore',

  handlers: {
    loadDistribution: Stories.DELETE_ELEMENT,
    updateElements: Stories.FETCH_ELEMENTS_DONE,
    getElements: Stories.FETCH_ELEMENTS,
  },

  // A distribution is a collection of data points named for its key.
  // In other words, it's a tag and information about where it appears.
  // That location information for now is encoded as a tweet_id and a
  // timestamp.

  getInitialState: function() {
    return {
      distributions: {
        -1: {},
        "arrests": {
          0: {

          }
        }
      }
    };
  },

  getDistributionList: function() { //Not a thing yet
    /*
    return this.fetch({
      id: "getDistributionList",
      locally:  function () {
        return;
      },
      remotely: function () {
        return this.app.DistributionActionCreators.fetchDistributions();
      }
    });
    */
  },

  /*
  updateDistributionList: function (distribution_list) {
    var story_elements = this.state.story_elements.splice(element_index, 1);
    this.setState({
      story_elements: story_elements
    });
  },
  */

  updateElements: function (elements, story_id) {
    var stories = this.state.stories;
    stories[story_id].elements = elements;
    this.setState({
      stories: stories
    });
  }
});

module.exports = ElementsStore;
