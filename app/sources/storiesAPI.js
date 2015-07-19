var storiesAPI = Marty.createStateSource({
  type: 'http',
  fetchElements: function (story_id) {
    return this.get({
      url: "/events/json/" + story_id
    }).then(function(res) { return res.body });
  }
});

module.exports = storiesAPI;
