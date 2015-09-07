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

var proposalConstants = require('../../constants/proposalConstants.js');

var prototype_proposal = {
  proposed_by: "Persona One",
  setting: ["pageMeta", "title"],
  new_value: "ProposalTest"
};

/* Proposal logic functions:
  qualifyProposal: accepts protoproposal --> null:
                {
                  proposed_by: [persona_id],
                  setting: ["groupname", "setting"],
                  new_value: String/Int
                }
   makeProposal: accepts protoproposal --> null:
                {
                  proposed_by: [persona_id],
                  setting: ["groupname", "setting"],
                  new_value: String/Int
                  id: Int,
                  proposed_at: new Moment,
                  current_agreements: [a copy of the current 'agreements' setting],
                  current_personas: [a copy of the current 'personas' list; these are the people who can participate in this process]
                  amendments: [],
                  consent_percentage: [an initial value based on percentage of users the proposer constitutes],
                  optimism: [a percentile measured against the current 'optimism threshhold' agreement to determine provisional implementation],
                  implemented: Boolean (true or false initially based on the optimism threshhold),
                  unvested_consenters: [array of persona_ids that suggested same thing but couldn't participate],
                  expired: False
                }
*/
// HANDLERS:


describe('proposalStore', function() {

  var setup = function(proposal_state, persona_state, settings_state) {
    var app, listener;

    var proposal_states = {
      default_state: {
        proposals: {}
      },
      one_proposal_state: {
        proposals: {
          0: {
            amendments: {},
            consent_percentage: 0.5,
            current_agreements: {
              optimism_threshhold:{value:0.5, type:"percentile"},
              consent_threshhold:{value:0.5, type:"percentile"}
            },
            current_personas: {
              "Persona One":  {
                actions:{},
                reactions:{},
                consent:true
              },
              "Persona Two":  {
                actions:{},
                reactions:{}
              }
            },
            expired: false,
            id: 0,
            implemented: false,
            new_value: "asdfasdf",
            old_value: "This site is great!",
            optimism: 0.5,
            proposed_at: "2015-09-04T01:33:04.162Z",
            proposed_by: "Persona One",
            setting: ["pageMeta", "title"],
            uninvested_consenters: {},
          }
        }
      }
    };

    var persona_states = {
      default_state: {
        active_persona: "Persona One",
        personas: {
          "Persona One": {
            actions:[],
            reactions: []
          }
        }
      },
      two_persona_state: {
        active_persona: "Persona One",
        personas: {
          "Persona One": {
            actions: [],
            reactions: []
          },
          "Persona Two": {
            actions: [],
            reactions: []
          }
        }
      },
      three_persona_state: {
        active_persona: "Persona One",
        personas: {
          "Persona One": {
            actions: [],
            reactions: []
          },
          "Persona Two": {
            actions: [],
            reactions: []
          },
          "Persona Three": {
            actions: [],
            reactions: []
          }
        }
      },
    };

    var settings_states = {
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


    app = createApplication(Application, {
      include: ['proposalStore',
                'settingsStore',
                'personaStore']
    });
    app.proposalStore.state = proposal_states[proposal_state];
    app.settingsStore.state = settings_states[settings_state];
    app.personaStore.state = persona_states[persona_state];
    listener = sinon.spy();
    app.proposalStore.addChangeListener(listener);
    return {app: app, listener: listener};
  };

  describe('HANDLERS', function() {



    describe('submitProposal', function() {

      describe('one persona, no proposal, default agreements behavior', function() {

      var handler_instance = setup("default_state", "default_state", "default_state");
      var app = handler_instance.app;
      var listener = handler_instance.listener;

        it('should accept protoproposal and return a new proposal with proper info, implemented', function() {

          var old_value = app.settingsStore.state.settings.pageMeta.title.value;
          var madeProposal = app.proposalStore.submitProposal(prototype_proposal);
          madeProposal.proposed_by.should.eql("Persona One");
          madeProposal.setting.should.eql(["pageMeta", "title"]);
          madeProposal.new_value.should.eql("ProposalTest");
          madeProposal.id.should.eql(0);
          madeProposal.old_value.should.eql(old_value);
          madeProposal.proposed_at.should.exist;
          madeProposal.current_agreements.should.eql(app.settingsStore.state.settings.agreements);
          madeProposal.current_personas.should.eql(app.personaStore.state.personas);
          madeProposal.current_personas[madeProposal.proposed_by].consent.should.eql(true);
          madeProposal.amendments.should.eql([]);
          madeProposal.consent_percentage.should.eql(1/Object.keys(madeProposal.current_personas).length);
          madeProposal.uninvested_consenters.should.eql([]);
          madeProposal.expired.should.eql(false);
          madeProposal.implemented.should.eql(true);
        });

      });

      describe('two persona, no proposal, default agreements behavior', function() {

        var handler_instance = setup("default_state", "two_persona_state", "default_state");
        var app = handler_instance.app;
        var listener = handler_instance.listener;

        it('should accept protoproposal and return a new proposal with proper info, not implemented', function() {

          var old_value = app.settingsStore.state.settings.pageMeta.title.value;
          var madeProposal = app.proposalStore.submitProposal(prototype_proposal);
          madeProposal.proposed_by.should.eql("Persona One");
          madeProposal.setting.should.eql(["pageMeta", "title"]);
          madeProposal.new_value.should.eql("ProposalTest");
          madeProposal.id.should.eql(0);
          madeProposal.old_value.should.eql(old_value);
          madeProposal.proposed_at.should.exist;
          madeProposal.current_agreements.should.eql(app.settingsStore.state.settings.agreements);
          madeProposal.current_personas.should.eql(app.personaStore.state.personas);
          madeProposal.current_personas[madeProposal.proposed_by].consent.should.eql(true);
          madeProposal.amendments.should.eql([]);
          madeProposal.consent_percentage.should.eql(1/Object.keys(madeProposal.current_personas).length);
          madeProposal.uninvested_consenters.should.eql([]);
          madeProposal.expired.should.eql(false);
          madeProposal.implemented.should.eql(false);
        });

      });

      describe('two persona, one proposal, default agreements behavior', function() {

        var handler_instance = setup("one_proposal_state", "two_persona_state", "default_state");
        var app = handler_instance.app;
        var listener = handler_instance.listener;

        it('should accept protoproposal and return a new proposal with proper info including id 1, unimplemented', function() {

          var old_value = app.settingsStore.state.settings.pageMeta.title.value;
          var madeProposal = app.proposalStore.submitProposal(prototype_proposal);
          madeProposal.proposed_by.should.eql("Persona One");
          madeProposal.setting.should.eql(["pageMeta", "title"]);
          madeProposal.new_value.should.eql("ProposalTest");
          madeProposal.id.should.eql(1);
          madeProposal.old_value.should.eql(old_value);
          madeProposal.proposed_at.should.exist;
          madeProposal.current_agreements.should.eql(app.settingsStore.state.settings.agreements);
          madeProposal.current_personas.should.eql(app.personaStore.state.personas);
          madeProposal.current_personas[madeProposal.proposed_by].consent.should.eql(true);
          madeProposal.amendments.should.eql([]);
          madeProposal.consent_percentage.should.eql(1/Object.keys(madeProposal.current_personas).length);
          madeProposal.uninvested_consenters.should.eql([]);
          madeProposal.expired.should.eql(false);
          madeProposal.implemented.should.eql(false);
        });

        it('should number the next new proposal 2', function() {
          var old_value = app.settingsStore.state.settings.pageMeta.title.value;
          var madeProposal = app.proposalStore.submitProposal(prototype_proposal);
          madeProposal.proposed_by.should.eql("Persona One");
          madeProposal.setting.should.eql(["pageMeta", "title"]);
          madeProposal.new_value.should.eql("ProposalTest");
          madeProposal.id.should.eql(2);
          madeProposal.old_value.should.eql(old_value);
          madeProposal.proposed_at.should.exist;
          madeProposal.current_agreements.should.eql(app.settingsStore.state.settings.agreements);
          madeProposal.current_personas.should.eql(app.personaStore.state.personas);
          madeProposal.current_personas[madeProposal.proposed_by].consent.should.eql(true);
          madeProposal.amendments.should.eql([]);
          madeProposal.consent_percentage.should.eql(1/Object.keys(madeProposal.current_personas).length);
          madeProposal.uninvested_consenters.should.eql([]);
          madeProposal.expired.should.eql(false);
          madeProposal.implemented.should.eql(false);
        });

      });
    });

    describe('consentToProposal', function() {

      var handler_instance = setup("one_proposal_state", "two_persona_state", "default_state");
      var app = handler_instance.app;
      var listener = handler_instance.listener;
      var pre_consent_percentage = app.proposalStore.state.proposals[0].consent_percentage;
      app.personaStore.setActivePersona("Persona Two");

      it('accepts valid proposal id and consents on behalf of valid current persona', function() {

        var active_persona = app.personaStore.getActivePersona();
        app.proposalStore.consentToProposal(0).should.eql("Consent percentage updated!");
        app.proposalStore.state.proposals[0].current_personas[active_persona].consent.should.eql(true);
      });

      it('...and it adjusts the proposals consent_percentage appropriately.', function() {
        var current_personas_length = _.size(app.proposalStore.state.proposals[0].current_personas);
        var desired_percentage = pre_consent_percentage + (1/current_personas_length);
        app.proposalStore.state.proposals[0].consent_percentage.should.eql(desired_percentage);
      });

      it('returns persona not enfranchised if invalid persona', function() {
        app.personaStore.addPersona("Persona Three");
        app.personaStore.setActivePersona("Persona Three");
        app.proposalStore.consentToProposal(0).should.eql("Persona not enfranchised!");
        var current_personas_length = _.size(app.proposalStore.state.proposals[0].current_personas);
        var desired_percentage = pre_consent_percentage + (1/current_personas_length);
        app.proposalStore.state.proposals[0].consent_percentage.should.eql(desired_percentage);
      });
    });
  });

  describe('QUERIES', function() {

    var handler_instance = setup("one_proposal_state", "two_persona_state", "default_state");
    var app = handler_instance.app;
    var listener = handler_instance.listener;

    describe('getProposalsByPersona', function() {

      it('should return an array of all proposals by a given persona id', function() {
        app.proposalStore.getProposalsByPersona("Persona One").should.eql(
          [{
            amendments: {},
            consent_percentage: 0.5,
            current_agreements: {
              optimism_threshhold:{value:0.5, type:"percentile"},
              consent_threshhold:{value:0.5, type:"percentile"}
            },
            current_personas: {
              "Persona One":  {
                actions:{},
                reactions:{},
                consent:true
              },
              "Persona Two":  {
                actions:{},
                reactions:{}
              }
            },
            expired: false,
            id: 0,
            implemented: false,
            new_value: "asdfasdf",
            old_value: "This site is great!",
            optimism: 0.5,
            proposed_at: "2015-09-04T01:33:04.162Z",
            proposed_by: "Persona One",
            setting: ["pageMeta", "title"],
            uninvested_consenters: {},
          }]
        );

      });
    });

    describe('getProposalsBySetting', function() {

      it('should return an array of all proposals regarding a given setting', function() {
        app.proposalStore.getProposalsBySetting(['pageMeta', 'title']).should.eql([
          {
            amendments: {},
            consent_percentage: 0.5,
            current_agreements: {
              optimism_threshhold:{value:0.5, type:"percentile"},
              consent_threshhold:{value:0.5, type:"percentile"}
            },
            current_personas: {
              "Persona One":  {
                actions:{},
                reactions:{},
                consent:true
              },
              "Persona Two":  {
                actions:{},
                reactions:{}
              }
            },
            expired: false,
            id: 0,
            implemented: false,
            new_value: "asdfasdf",
            old_value: "This site is great!",
            optimism: 0.5,
            proposed_at: "2015-09-04T01:33:04.162Z",
            proposed_by: "Persona One",
            setting: ["pageMeta", "title"],
            uninvested_consenters: {},
          }
        ]);

      });

    });

    describe('getProposalsByContent', function() {

      it('returns proposals with same new value for setting', function() {
        app.proposalStore.getProposalsByContent(['pageMeta', 'title'], "asdfasdf").should.eql([
          {
            amendments: {},
            consent_percentage: 0.5,
            current_agreements: {
              optimism_threshhold:{value:0.5, type:"percentile"},
              consent_threshhold:{value:0.5, type:"percentile"}
            },
            current_personas: {
              "Persona One":  {
                actions:{},
                reactions:{},
                consent:true
              },
              "Persona Two":  {
                actions:{},
                reactions:{}
              }
            },
            expired: false,
            id: 0,
            implemented: false,
            new_value: "asdfasdf",
            old_value: "This site is great!",
            optimism: 0.5,
            proposed_at: "2015-09-04T01:33:04.162Z",
            proposed_by: "Persona One",
            setting: ["pageMeta", "title"],
            uninvested_consenters: {},
          }
        ]);
      });
    });

    describe('findProposal', function() {

      it('should accept proposal_id and return proposal with that id', function() {
        app.proposalStore.findProposal(0).should.eql(
          {0:

            {
              amendments: {},
              consent_percentage: 0.5,
              current_agreements: {
                optimism_threshhold:{value:0.5, type:"percentile"},
                consent_threshhold:{value:0.5, type:"percentile"}
              },
              current_personas: {
                "Persona One":  {
                  actions:{},
                  reactions:{},
                  consent:true
                },
                "Persona Two":  {
                  actions:{},
                  reactions:{}
                }
              },
              expired: false,
              id: 0,
              implemented: false,
              new_value: "asdfasdf",
              old_value: "This site is great!",
              optimism: 0.5,
              proposed_at: "2015-09-04T01:33:04.162Z",
              proposed_by: "Persona One",
              setting: ["pageMeta", "title"],
              uninvested_consenters: {},
            }
          });
      });

      it('should accept null, Persona One, pageMeta title, and asdfasdf and return proposal wrapped in object with correct index', function() {
        app.proposalStore.findProposal(null, "Persona One", ["pageMeta", "title"], "asdfasdf").should.eql(
          {0:

            {
              amendments: {},
              consent_percentage: 0.5,
              current_agreements: {
                optimism_threshhold:{value:0.5, type:"percentile"},
                consent_threshhold:{value:0.5, type:"percentile"}
              },
              current_personas: {
                "Persona One":  {
                  actions:{},
                  reactions:{},
                  consent:true
                },
                "Persona Two":  {
                  actions:{},
                  reactions:{}
                }
              },
              expired: false,
              id: 0,
              implemented: false,
              new_value: "asdfasdf",
              old_value: "This site is great!",
              optimism: 0.5,
              proposed_at: "2015-09-04T01:33:04.162Z",
              proposed_by: "Persona One",
              setting: ["pageMeta", "title"],
              uninvested_consenters: {},
            }
          });
      });

      it('should return No such proposal if no matching proposal_id should be found', function() {
        app.proposalStore.findProposal(1).should.eql("No such proposal!");
      });

      it('should return No such proposal if no matching persona / setting / new_value', function() {
        app.proposalStore.findProposal(null, "Persona Two", ['nope', 'nada'], 'nope' ).should.eql("No such proposal!");
      });

    });

    describe('getOpenProposals', function() {

      var handler_instance = setup("default_state", "two_persona_state", "default_state");
      var app = handler_instance.app;
      var listener = handler_instance.listener;

      app.proposalStore.submitProposal(prototype_proposal);

      it('should return all proposals that are unexpired and not yet implemented', function() {
        var open_proposals = app.proposalStore.getOpenProposals();
        open_proposals[0].new_value.should.eql("ProposalTest");
        open_proposals.length.should.eql(1);


      });

    });

    describe('getClosedProposals', function() {

      var handler_instance = setup("default_state", "default_state", "default_state");
      var app = handler_instance.app;
      var listener = handler_instance.listener;

      it('should return all proposals that are either implemented and closed or unimplemented and expired', function() {

        app.proposalStore.submitProposal(prototype_proposal);

        var closed_proposals = app.proposalStore.getClosedProposals();
        closed_proposals.length.should.eql(1);
        closed_proposals[0].new_value.should.eql("ProposalTest");

      });

    });

    describe('getOpenProposal', function() {

      var handler_instance = setup("one_proposal_state", "default_state", "default_state");
      var app = handler_instance.app;
      var listener = handler_instance.listener;

      it('returns one open proposal for a given setting', function() {

        var open_proposal = app.proposalStore.getOpenProposal(['pageMeta', 'title']);
        open_proposal.id.should.eql(0);

      });

    });

  });

  describe('HELPERS', function() {

    describe('saveChangeProposal', function() {




      it('should take a proposal that has been changed and save it and if appropriate test it for consensus', function() {

        var handler_instance = setup("one_proposal_state", "two_persona_state", "default_state");
        var app = handler_instance.app;
        var listener = handler_instance.listener;

        var proposal = app.proposalStore.state.proposals[0];
        proposal.consent_percentage = 1;
        app.proposalStore.saveChangedProposal(proposal).should.eql("Proposal updated");


      });

      it('should take an already implemented proposal and reject with message', function() {

        var handler_instance = setup("default_state", "default_state", "default_state");
        var app = handler_instance.app;
        var listener = handler_instance.listener;

        app.proposalStore.submitProposal(prototype_proposal);

        app.proposalStore.saveChangedProposal(app.proposalStore.state.proposals[0]).should.eql("Proposal already implemented");

      });




    });


  });




});
