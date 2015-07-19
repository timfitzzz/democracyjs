
/* global require */

var Results = React.createClass({

  displayName: "Results",

	render: function() {
		var self = this;
		return (<div style={{background: this.props.settings.backgroundcolor.value}}>Title: {this.props.settings.title.value}</div>);
  }
});

module.exports = Marty.createContainer(Results, {
  listenTo: ["settingsStore"],
  fetch: function () {
    return this.app.settingsStore.state;
  }}
);
