var _ = require('underscore');
require('marty-test-utils');
var chai = require('chai');
var should = chai.should();
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var Application = require('../../App.js');
var createApplication = require('marty/test-utils').createApplication;
var dispatch = require('marty/test-utils').dispatch;

var settingsConstants = require('../../constants/settingsConstants.js');

describe('settingsStore', function() {

  var setup = function(state) {
    var app, listener;

    var states = {
      default_state: {
        settings: {
          pageMeta: {
            title:  {
              value: "NoKings!",
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

    app = createApplication(Application, {
      include: ['settingsStore']
    });
    app.settingsStore.state = states[state];
    listener = sinon.spy();
    app.settingsStore.addChangeListener(listener);
    return {app: app, listener: listener};
  };

  describe('HANDLERS', function() {

    var handler_instance = setup("default_state");
    var app = handler_instance.app;
    var listener = handler_instance.listener;

    describe('changeSetting', function() {

      it('should accept valid group, setting, and new value and modify state accordingly', function() {
        app.settingsStore.changeSetting("agreements", "consent_threshhold", 0.4);
        app.settingsStore.state.settings.agreements.consent_threshhold.value.should.eql(0.4);
      });

      it('should reject invalid group, setting, and new value and return false', function(){
        app.settingsStore.changeSetting("agreementz", "googlyeyes", "notathing").should.eql(false);
        app.settingsStore.state.settings.hasOwnProperty('agreementz').should.eql(false);
      });

      it('should reject invalid setting in valid group, and return false', function() {
        app.settingsStore.changeSetting("agreements", "googlyeyes", "notathingeither").should.eql(false);
        app.settingsStore.state.settings.agreements.hasOwnProperty('googlyeyes').should.eql(false);
      });
    });

  });

  describe('QUERIES', function() {

    var handler_instance = setup("default_state");
    var app = handler_instance.app;
    var listener = handler_instance.listener;

    describe('getAllSettings', function() {
      it('returns all current settings', function() {
        app.settingsStore.getAllSettings().should.eql({
          pageMeta: {
            title:  { value: "This site is great!", type: "shortText" },
            backgroundcolor: { value: "#FFFFAA", type: "CSS" }
          },
          agreements: {
            optimism_threshhold: { value: 0.5, type: "percentile" },
            consent_threshhold: { value: 0.5, type: "percentile" }
          }
        });
      });
    });

    describe('getSettingGroup', function() {
      it('returns all settings in given group', function() {
        app.settingsStore.getSettingGroup("agreements").should.eql({
          optimism_threshhold: { value: 0.5, type: "percentile" },
          consent_threshhold: { value: 0.5, type: "percentile" }
        });
      });
    });

    describe('getSettingValue', function() {
      it('returns value of setting submitted as setting array', function() {
        app.settingsStore.getSettingValue(['agreements', 'consent_threshhold']).should.eql(0.5);
      });
    });

    describe('getSetting', function() {
      it('returns setting object for given groupname and setting name', function() {
        app.settingsStore.getSetting('agreements', 'consent_threshhold').should.eql(
          { value: 0.5, type: "percentile" });
      });
    });

    describe('isCurrentSetting', function() {
      it('returns true if setting mapped to submitted object has submitted value', function() {
        app.settingsStore.isCurrentSetting(['agreements', 'consent_threshhold'], 0.5).should.eql(true);
      });

      it('returns false if setting mapped to submitted object does not have submitted value', function() {
        app.settingsStore.isCurrentSetting(['agreements', 'consent_threshhold'], 0.4).should.eql(false);
      });
    });

  });




});
