// tests!

var Marty = require('marty');
var _ = require('underscore');
var Moment = require('moment');
require('marty-test-utils');
var should = require('should');
var sinon = require('sinon');
/*

mockStore('MyStore', {
  method1: spy()
});

mockComponent('Test'); // => <div></div>
mockComponent('Test', 'span'); // => <span></span>

const dispatcher = Marty.dispatcher.getDefault();

it('tests a dispatched action', (done) => {
  onDispatchedAction(dispatcher, wcheck(done, (payload) => {
    assert(true); // <-- here go your tests
  }));

  ActionCreators.doSomething();
});

const dispatcher = Marty.dispatcher.getDefault();

it('tests a store change', (done) => {
  onStoreChange(Store, wcheck(done, (state) => {
    assert(true); // <-- here go your tests
  }));

  // Fake the dispatcher emitting an action
  dispatcher.dispatchAction({type: Mock.Constants.USER_SET_EMAIL, arguments: [EMAIL]});
});

*/



describe('proposalStore', function() {

  var setup = function(proposals_state, settings_state) {
    var app = createApplication(Application, { include: ['proposalStore', 'settingsStore']});
    app.proposalStore.state = proposals_state;
    app.settingsStore.state = settings_state;

    var listener = sinon.spy();
    app.proposalStore.addChangeListener(listener);
    return [app, listener];
  };

  describe('retrievers', function() {

    var settings_state = {
      settings: {
        pageMeta: {
          title: "Hello"
        }
      }
    };

    var proposal_state = {
      proposals: {
        0: {
          proposed_by: 'persona_one',
          setting_affected: ['pageMeta', 'title'],
          current_personas: ['persona_one', 'test_user'],
          new_value: "Hello",
          consent_percentage: 0.5
        }
      }
    };

    var protoproposal_base = {
        };



    var protoproposal_with_current_value = _.merge({}, protoproposal_base, {
        proposed_by: 'test_user',
        setting_affected: ['pageMeta', 'title'],
        new_value: "Hello"
    });

    var protoproposal_with_different_value = _.merge({}, protoproposal_base, {
        proposed_by: 'test_user',
        setting_affected: ['pageMeta', 'title'],
        new_value: "WEEEEEEEEEEEEEEEEEADFASDF"
    });

    var protoproposal_with_different_value_where_proposer_cant_vote = _.merge({}, protoproposal_base, {
        proposed_by: 'test_user2',
        setting_affected: ['pageMeta', 'title'],
        new_value: "WHOOP"
    });

    var unique_protoproposal = _.merge({}, protoproposal_base, {
        proposed_by: 'test_user',
        setting_affected: ['pageMeta', 'backgroundcolor'],
        new_value: "#000000"
    });

    describe('returnProposalHandler', function() {

      setup(proposals_state, settings_state);

      it('should return appropriate handler function based on proposal content', function() {

        app.proposalStore.returnProposalHandler(protoproposal_with_current_value).should.be('proposalIsRedundant');
        app.proposalStore.returnProposalHandler(protoproposal_with_different_value).should.be('addAmendmentToProposal');
        app.proposalStore.returnProposalHandler(protoproposal_with_different_value_where_proposer_cant_vote).should.be('joinPeanutGalleryOnProposal');
        app.proposalStore.returnProposalHandler(unique_protoproposal).should.be('makeProposal');
      });
    });

    describe('proposalIsRedundant', function() {

      setup(proposals_state, settings_state);

      it('should generate an alert: it\'s already set to that', function() {
        app.ProposalStore.proposalIsRedundant().should.be(true);
      });
    });

    describe('addAmendmentToProposal', function() {

      setup(proposals_state, settings_state);

      it('should append amendment protoproposal to amendments array of proposals[0] in proposal_store', function() {
        app.ProposalStore.addAmendmentToProposal(0, protoproposal_with_different_value);
        app.ProposalStore.state.proposals[0].amendments[0].should.eql(protoproposal_with_different_value);
      });
    });

    describe('joinPeanutGalleryOnProposal', function() {

      setup(proposals_state, settings_state);

      it('should append proposer name to uninvested_consenters and return changed proposal', function() {
        app.ProposalStore.joinPeanutGalleryOnProposal(protoproposal_with_different_value_where_proposer_cant_vote).should.eql(true);
        app.ProposalStore.state.proposals[0].uninvested_consenters[0].should.eql(protoproposal_with_different_value_where_proposer_cant_vote.proposed_by);
      });
    });

    describe('makeProposal', function() {

      setup(proposals_state, settings_state);

      it('should create a new proposal out of the protoproposal and return it', function() {
        app.ProposalStore.makeProposal(unique_protoproposal).id.should.eql(1);
      });
    });

    describe('saveChangedProposal', function() {

      setup(proposals_state, settings_state);

      it('should save a newly made proposal to the proposalStore state', function(){
        var proposal = app.ProposalStore.makeProposal(unique_protoproposal);
        app.ProposalStore.saveChangedProposal(proposal);
        app.ProposalStore.state.proposals[1].should.eql(proposal);
      });

      it('should save an existing modified proposal to the existing proposalStore location', function() {
        var proposal = app.ProposalStore.state.proposals[0];
        proposal.uninvested_consenters.push("test_consenter");
        app.ProposalStore.saveChangedProposal(proposal);
        app.ProposalStore.state.proposals[0].uninvested_consenters[0].should.eql("test_consenter");
      });

    });

    describe('testProposal', function() {

      // there are five possible outcomes of testing a proposal.
      // -- "implemented_permanently" means it's already been implemented and closed
      //    and proposal is therefore inert.
      // -- "implement_optimistically" means that although the proposal is not closed
      //    its change should be applied to the settings store until further notice.
      // -- "implement_provisionally" is similar to implement_optimistically except
      //    it means that the consent_threshhold has been reached, pending
      //    expiration of the proposal's open period.
      // -- "not_yet_implemented" means that its consent threshhold has not been reached,
      //    it does not exceed the optimism threshhold, and the timer has not expired.
      // -- "abandoned" means that its consent threshhold was not exceeded within the duration
      //    and therefore it is inert and was not applied.
      //
      //  parameterizing this may end up being tricky!
      //  right now there are three pairs of parameters and threshholds that are
      //  evaluated:
      //
      //  -- [proposal].consent_percentage: this is the percentage of the number of personas that existed
      //                                    at the time the proposal is made that have consented to it.
      //  -- [proposal].current_agreements.consent_threshhold: this is pulled from the agreements setting
      //                                    at the time the proposal is made and is the required consent_percentage
      //                                    the consent_percentage must exceed at timer expiration for it to succeed.
      //
      //  -- [proposal].optimism: optimism is a measurement of the proposer's credibility. how this number gets generated
      //                          is TBD. for now everyone is .5.
      //  -- [proposal].current_agreements.optimism_threshhold: this is pulled from the agreements setting
      //                          at the time the proposal is made and is the required optimism threshhold for
      //                          a proposal to be optimistically implemented.
      //
      //  -- [proposal].proposed_at: this is the time the proposal began.
      //  -- [proposal].current_agreements.proposal_duration: this is the agreed upon time a proposal is open
      //                                                      for voting before it is finally evaluated.

      setup(proposals_state, settings_state);

      it('should return implemented_permanently if proposal implemented = permanently', function() {

      });

      it('should return implement_provisionally if proposal consent_percentage exceeds its current_agreements.consent_threshhold but the proposals timer has not yet expired', function () {


      });

      it('should return implement_optimistically if proposal optimism exceeds current_agreements.optimism_threshhold,', function() {

      });


      it('should return implement_permanently if proposal consent_percentage exceeds current consent threshhold and the timer is expired', function() {

      });

    });

    describe('implementProposal', function() {

      it('should accept a proposal and an implementation string and act accordingly', function() {

      });

    });
  });
});
