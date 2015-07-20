
/* global require */

var Results = React.createClass({

  displayName: "Results",

  getInitialState: function() {
    var settings = this.props.settings.pageMeta;
    return {
      layout: (<div style={{background: settings.backgroundcolor.value}}>Title: {settings.title.value}</div>)
    };
  },

  refreshLayout: function() {
    this.setState({
      layout: "ok"
    });
  },

	render: function() {
		var self = this;
		return (eval(this.state.layout));
  }
});

module.exports = Marty.createContainer(Results, {
  listenTo: ['settingsStore'],
  fetch: {
    settings: function() {
      this.app.settingsStore.getAllSettings();
    }
  }}
);
