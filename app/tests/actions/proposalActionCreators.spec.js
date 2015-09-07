var _ = require('underscore');
require('marty-test-utils');
var chai = require('chai');
var should = chai.should();

var Application = require('../../App.js');
var createApplication = require('marty/test-utils').createApplication;
var hasDispatched = require('marty/test-utils').hasDispatched;

var ProposalConstants = require('../../constants/proposalConstants');

describe('proposalActions', function() {
  var app;

  beforeEach( function() {
      app = createApplication(Application, {
        include: ['proposalActionCreators']
      });
  });

  var prototype_proposal = {
    proposed_by: "Persona One",
    setting: ["pageMeta", "title"],
    new_value: "ProposalTest"
  };

  describe('submitProposal', function() {

    it('dispatches SUBMIT_PROPOSAL to stores with provided proposal_object', function(){

      app.proposalActionCreators.submitProposal(_.extend({}, prototype_proposal));
      hasDispatched(app, ProposalConstants.SUBMIT_PROPOSAL, prototype_proposal).should.eql(true);

    });
  });

  describe('consentToProposal', function() {

    it('dispatches CONSENT_TO_PROPOSAL to stores with persona_id and proposal_id', function() {

      app.proposalActionCreators.consentToProposal("Persona One", 0);
      hasDispatched(app, ProposalConstants.CONSENT_TO_PROPOSAL, "Persona One", 0).should.eql(true);

    });
  });

  describe('amendProposal', function() {

    it('dispatches AMEND_PROPOSAL to stores with submitted arguments', function() {

      app.proposalActionCreators.amendProposal("Persona One", 0, {proposal_object: "yes"});
      hasDispatched(app, ProposalConstants.AMEND_PROPOSAL, "Persona One", 0, {proposal_object: "yes"}).should.eql(true);

    });
  });

  describe('blockProposal', function() {

    it('dispatches BLOCK_PROPOSAL to stores with submitted arguments', function() {

      app.proposalActionCreators.blockProposal("Persona One", 0);
      hasDispatched(app, ProposalConstants.BLOCK_PROPOSAL, "Persona One", 0);

    });
  });

});
