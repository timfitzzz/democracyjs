'use strict'
/* global require */
/* global React */
/*global module */

var Marty = require('marty');
var Panel = require('react-bootstrap').Panel;
var _ = require('underscore');
var PageHeader = require('react-bootstrap').PageHeader;

var SiteHeader = React.createClass({

  displayName: "SiteHeader",

  render: function() {
    return (
      <Panel>
        <PageHeader>
          {this.props.site_title}<br></br>
        <small>{this.props.site_description}</small>
        </PageHeader>
      </Panel>
    );

  }

});

module.exports = Marty.createContainer(SiteHeader, {
  listenTo: ["settingsStore"],
  fetch: {
    site_title: function() {
      return this.app.settingsStore.getSettingValue(['pageMeta', 'title']);
    },
    site_description: function() {
      return this.app.settingsStore.getSettingValue(['pageMeta', 'description']);
    }
  }
});
