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

    var proposalStoreSpies = {
      submitProposal: sinon.spy()
    };

    var proposalActionCreatorsSpies = {
      submitProposal: sinon.spy()
    };

    app = createApplication(Application, {
      include: ['settingsStore',
                'personaStore',
                'proposalStore'],
      stub: {
        settingsActionCreators: settingsActionCreatorsSpies,
        proposalStore: proposalStoreSpies,
        proposalActionCreators: proposalActionCreatorsSpies
      }
    });

    app.settingsStore.state = states[state];
    app.personaStore.state.current_persona = "Persona One";

    var component = propTree(app, states[state].settings);

    return {
      component: component,
      app: app,
      states: states
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



      describe('SettingChangeProposer', function() {

        it('should exist for a given SettingGroup inside a SettingPanel', function() {
          for (var key in app.settingsStore.state.settings) {
            if (app.settingsStore.state.settings.hasOwnProperty(key)) {
              for (var setting in key) {
                if (app.settingsStore.state.settings[key].hasOwnProperty(setting)) {
                  component.component[key + "Group"].component[setting+"Panel"].component[setting+"Proposer"].should.exist;
                }
              }
            }
          }

        });
      });
    });

  });

  describe('INTERACTIVITY', function() {
    var instance = setup("default_state");
    var app = instance.app;
    var component = instance.component;

    describe('SettingChangeProposer', function() {

      var proposerComponent = component.
                              pageMetaGroup.
                              titlePanel.
                              innerComponent.
                              titleProposer;

      describe('onChange', function() {
        it('should set state with object.target.value', function() {
          var object = {
            target: {
              value: "e"
            }
          };
          proposerComponent.element.onChange(object);
          proposerComponent.state.field_value.should.eql("e");
        });
      });

      describe('changerField', function() {
        it ('should call onChange to change field_value with whatever changes', function() {
          proposerComponent.changerField.value = 'a';
          proposerComponent.changerField.simulate.change();
          proposerComponent.state.field_value.should.eql('a');
        });

      });

      describe('changeSubmitter', function() {
        it('should submit setting change with submitProposal when clicked', function(){
          proposerComponent.changeSubmitter.simulate.click();
          app.proposalActionCreators.submitProposal.should.have.been.calledWith({
            proposed_by: "Persona One",
            setting: ["pageMeta", "title"],
            new_value: "a"
          });
        });
      });

    });

  });

  describe('REACTIVITY', function() {

    it('should receive new settings when there is a change', function() {
      var instance = setup("default_state");
      var app = instance.app;
      var component = instance.component;
      var states = instance.states;

      component.getProp("settings").should.eql(states.default_state.settings);
      app.settingsStore.changeSetting("agreements", "consent_threshhold", 0.4);
      component.getProp("settings").agreements.consent_threshhold.value.should.eql(0.4);
    });

  });

});
