/*
Proposal Object:

  (The client submits this basic proposal object:)
  {
    proposed_by: [persona_id],
    setting_affected: ["setting", |optional: "groupname"],
    new_value: String/Int

  (The store appends the following information:)

    proposed_at: new Moment,
    current_agreements: [a copy of the current 'agreements' setting],
    current_personas: [a copy of the current 'personas' list; these are the people who can participate in this process]
    amendments: [],
    consent_percentage: [an initial value based on percentage of users the proposer constitutes],
    optimism: [a percentile measured against the current 'optimism threshhold' agreement to determine provisional implementation],
    implemented: Boolean (true or false initially based on the optimism threshhold),
    unvested_consenters: [array of persona_ids that suggested same thing but couldn't participate]
  }

Use of types could be interesting here, but I'm not sure the best way to do that so let's set that aside for now...


*/


var Marty = require('marty');
var ProposalConstants = require('../constants/proposalConstants.js');

var ProposalActionCreators = Marty.createActionCreators({

  id: "ProposalActionCreators",

  makeProposal: function(proposal_object) {
    this.dispatch(ProposalConstants.MAKE_PROPOSAL, proposal_object);
  },

  consentToProposal: function(persona_id, proposal_id) {
    this.dispatch(ProposalConstants.CONSENT_TO_PROPOSAL, persona_id, proposal_id);
  },

  amendProposal: function(persona_id, proposal_id, amended_proposal_object) {
    this.dispatch(ProposalConstants.AMEND_PROPOSAL, persona_id, proposal_id, amended_proposal_object);
  },

  blockProposal: function(persona_id, proposal_id) {
    this.dispatch(ProposalConstants.BLOCK_PROPOSAL, persona_id, proposal_id);
  },

  implementProposal: function(proposal_id) {
    this.dispatch(ProposalConstants.IMPLEMENT_PROPOSAL, proposal_id);
  },

  unimplementProposal: function(proposal_id) {
    this.dispatch(ProposalConstants.UNIMPLEMENT_PROPOSAL, proposal_id);
  }
});

module.exports = ProposalActionCreators;
