
/* global require */

var Results = React.createClass({

  displayName: "Results",


	render: function() {
		var self = this;
    var settings = this.props.settings.pageMeta;
		return (<div style={{background: settings.backgroundcolor.value}}>Title: {settings.title.value}</div>);
  }
});

module.exports = Marty.createContainer(Results, {
  listenTo: ['settingsStore'],
  fetch: {
    settings: function() {
      return this.app.settingsStore.getAllSettings();
    }
  }}
);
