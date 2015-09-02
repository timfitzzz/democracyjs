var _ = require('underscore');
require('marty-test-utils');
var chai = require('chai');
var should = chai.should;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var Application = require('../../App.js');
var createApplication = require('marty/test-utils').createApplication;
var dispatch = require('marty/test-utils').dispatch;

var SettingsBoard = require('../../views/SettingsBoard.jsx');
var testTree = require('react-test-tree');
var SettingsConstants = require('../../constants/settingsConstants');

describe('SettingsBoard', function() {
  var app, listener;

  var setup = function(state) {

    var states = {
      default_state: {
        settings: {
          pageMeta: {
            title:  {
              value: "This site is great!",
              type: "shortText"
            },
            backgroundcolor: {
              value: "#FFFFAA",
              type: "CSS"
            }
          },
          agreements: {
            optimism_threshhold: {
              value: 0.5,
              type: "percentile"
            },
            consent_threshhold: {
              value: 0.5,
              type: "percentile"
            }
          }
        }
      }
    };

    var settingsQueryStubs = {
      getAllSettings: sinon.stub(),
      getSettingGroup: sinon.stub(),
      getSettingValue: sinon.stub(),
      getSetting: sinon.stub(),
      isCurrentSetting: sinon.stub()
    };

    var settingsActionCreatorsSpies = {
      changeSetting: sinon.spy()
    };

    app = createApplication(Application, {
      include: ['settingsStore'],
      stub: {
        settingsActionCreators: settingsActionCreatorsSpies
      }
    });

    app.settingsStore.state = states[state];

    var component = propTree(app, states[state].settings);

    return {
      component: component,
      app: app
    };

  };

  var propTree = function(app, settings) {
    return testTree(<SettingsBoard.InnerComponent settings={settings} />, {context: {app: app}});
  };

  var tree = function(app, settings) {
    return testTree(<SettingsBoard />, {context: {app: app}} );
  };

  describe('CONTENTS', function() {
    var component = setup("default_state");

    describe('SettingGroups', function() {

      it('there is a SettingGroup for each key in settings', function() {
        for (var key in app.settingsStore.state.settings) {
          if (app.settingsStore.state.settings.hasOwnProperty(key)) {
            component.component[key + "Group"].should.exist;
          }
        }
      });
    });



  });

  describe('INTERACTIVITY', function() {

  });

  describe('REACTIVITY', function() {

  });

});
