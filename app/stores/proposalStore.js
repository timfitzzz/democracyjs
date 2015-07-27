var Marty = require('marty');
var ProposalConstants = require('../constants/proposalConstants.js');
var _ = require('underscore');

var ProposalStore = Marty.createStore({
  displayName: 'ProposalStore',

  handlers: {
    makeProposal: ProposalConstants.MAKE_PROPOSAL,
    consentToProposal: ProposalConstants.CONSENT_TO_PROPOSAL,
    amendProposal: ProposalConstants.AMEND_PROPOSAL,
    blockProposal: ProposalConstants.BLOCK_PROPOSAL,
    implementProposal: ProposalConstants.IMPLEMENT_PROPOSAL,
    unimplementProposal: ProposalConstants.UNIMPLEMENT_PROPOSAL
  },

  getInitialState: function() {
    return {
      proposals: {}
    }
  },

  makeProposal: function(proposal_object) {
    /* Proposal logic:
       -- Q: does proposal exist? (same user, same setting, same new value)
          -- if yes: return "Proposal already exists" alert and end
       -- if no: Q: is there already an unimplemented proposal for same setting?
          -- if yes: Q: is the proposed new value the same?
              -- if yes: Q: is proposer in identical proposal's current_personas list?
                -- if yes: submit consentToProposal on behalf of user
                -- if no: hmm, do nothing for now I guess?
          -- if no: proposal becomes an amendment
       -- if no: create new proposal
          -- record proposed_at: new Moment,
          -- save current_agreements
          -- save current_personas
          -- set amendments: []
          -- set initial consent_percentage (1/current_personas.length])
          -- set optimism: personas's optimism score, math tbd (default 50%)
          -- set uninvested_consenters
          -- Q: is optimism percentage greater than current_agreements.optimism_threshhold?
              -- if yes: call implementProposal
          -- Q: is initial current consent_percentage > current_agreements.consent_threshhold?
              -- if yes: call implementProposal
              -- if no: set implemented to false
          -- save proposal to state
    */
  },

  consentToProposal: function (persona_id, proposal_id) {

  },

  amendProposal: function(persona_id, proposal_id, amended_proposal_object) {

  },

  blockProposal: function(persona_id, proposal_id) {

  },

  implementProposal: function(proposal_id) {

  },

  unimplementProposal: function(proposal_id) {

  }

});

module.exports = ProposalStore;
