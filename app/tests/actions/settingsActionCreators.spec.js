var _ = require('underscore');
require('marty-test-utils');
var chai = require('chai');
var should = chai.should();

var Application = require('../../App.js');
var createApplication = require('marty/test-utils').createApplication;
var hasDispatched = require('marty/test-utils').hasDispatched;

var SettingsConstants = require('../../constants/settingsConstants');

describe('settingsActions', function() {
  var app;

  beforeEach( function() {
      app = createApplication(Application, {
        include: ['settingsActionCreators']
      });
  });

  describe('changeSetting', function() {

    it('dispatches CHANGE_SETTING to stores with provided group_name, setting_name, and new_value', function(){

      app.settingsActionCreators.changeSetting("agreements", "consent_threshhold", 0.4);
      hasDispatched(app, SettingsConstants.CHANGE_SETTING, "agreements", "consent_threshhold", 0.4).should.eql(true);

    });

  });

});
