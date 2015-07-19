var _ = require('underscore');
var $ = require('jquery');

module.exports = {
  fetch: function(story_id) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        $.ajax({
          url: "http://localhost:3001/events/json/" + story_id,
          dataType: 'json',
          cache: false,
          success: function(data) {
                      resolve(data);
                   }.bind(this),
          error: function(xhr, status, err) {
                      console.log(status, err);
                 }.bind(this),
          crossDomain: true
        });
      }, 250);
    });
  }
};
