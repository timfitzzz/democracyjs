var Marty = require('marty');
var ProposalConstants = require('../constants/proposalConstants.js');
var _ = require('underscore');
var Moment = require('moment');

var ProposalStore = Marty.createStore({
  displayName: 'ProposalStore',
  handlers: {
    submitProposal: ProposalConstants.SUBMIT_PROPOSAL,
    consentToProposal: ProposalConstants.CONSENT_TO_PROPOSAL,
    amendProposal: ProposalConstants.AMEND_PROPOSAL,
    blockProposal: ProposalConstants.BLOCK_PROPOSAL,
  },

  getInitialState: function() {
    return {
      proposals: {}
    };
  },



  submitProposal: function(protoproposal) {
    var new_proposal = this.makeProposal(protoproposal);
    this.testProposal(this.saveNewProposal(new_proposal));
    return new_proposal;
  },

  consentToProposal: function (proposal_id) {
    var active_persona = this.app.personaStore.getActivePersona();
    var proposal = this.state.proposals[proposal_id];
    if (proposal.current_personas[active_persona]) {
      proposal.current_personas[active_persona].consent = true;
      this.updateConsentPercentage(proposal_id);
      return("Consent percentage updated!");
    }
    else {
      return("Persona not enfranchised!");
    }
  },

  amendProposal: function(persona_id, proposal_id, amended_proposal_object) {

  },

  blockProposal: function(persona_id, proposal_id) {

  },

  // HELPERS

  makeProposal: function(protoproposal) {
    // actually enter proposal into being
    var new_proposal = protoproposal;
    if (this.state.proposals[0]) {
      new_proposal.id = _.size(this.state.proposals);
    }
    else {
      new_proposal.id = 0;
    }
    new_proposal.old_value = this.app.settingsStore.getSettingValue(new_proposal.setting);
    new_proposal.proposed_at = new Moment();
    new_proposal.current_agreements = this.app.settingsStore.state.settings.agreements;
    new_proposal.current_personas = this.app.personaStore.state.personas;
    new_proposal.current_personas[new_proposal.proposed_by].consent = true;
    new_proposal.amendments = [];
    new_proposal.consent_percentage = (1/Object.keys(new_proposal.current_personas).length);
    new_proposal.optimism = 0.5; // placeholder, there should be some actual math here
    new_proposal.uninvested_consenters = [];
    new_proposal.expired = false;
    new_proposal.implemented = false;
    return(new_proposal);
  },

  testProposal: function(proposal_id) {
    var proposal = this.state.proposals[proposal_id];
    // relevant data:
    // var propo_optimism = proposal.optimism;                 // proposal's optimism value
    var propo_consent = proposal.consent_percentage;        // proposal's consent value
    // var propo_optimism_threshhold = proposal.current_agreements.optimism_threshhold; // optimism_threshhold at time of proposal
    var propo_consent_threshhold = proposal.current_agreements.consent_threshhold.value; // consent_threshhold at time of proposal
    // ar propo_time_since_proposed = Moment.duration(new Moment() - proposal.proposed_at);
    //
    // is optimism percentage greater than current_agreements.optimism_threshhold?
    /* if (propo_optim
        -- if yes: call implementProposal
    -- Q: is initial current consent_percentage > current_agreements.consent_threshhold?
        -- if yes: call implementProposal
        -- if no: set implemented to false
    -- save proposal to state */
    if(propo_consent > propo_consent_threshhold) {
      this.implementProposal(proposal_id);
    }
    else {
      return;
    }
  },

  implementProposal: function(proposal_id) {
    var proposal = this.state.proposals[proposal_id];
    this.app.settingsStore.changeSetting(proposal.setting[0],
                                                          proposal.setting[1],
                                                        proposal.new_value);
    proposal.implemented = true;
  },

  joinPeanutGalleryOnProposal: function(protoproposal) {

  },

  updateConsentPercentage: function(proposal_id) {
    var proposal = this.state.proposals[proposal_id];
    var new_consent_percentage =
        _.size(_.where(proposal.current_personas, {consent: true}))/_.size(proposal.current_personas);
    if (proposal.consent_percentage == new_consent_percentage) {
      return;
    }
    else {
      var new_state = this.state.proposals;
      new_state[proposal_id].consent_percentage = new_consent_percentage;
      this.setState({
        proposals: new_state
      });
      this.testProposal(proposal_id);
    }
  },

  unimplementProposal: function(proposal_id) {

  },


  // QUERY FUNCTIONS

  // getProposalsByPersona: (String) -> {{Proposal},{Proposal} ... }
  //                        Returns all proposals submitted by persona_id.
  getProposalsByPersona: function(persona_id) {
    return _.map(this.state.proposals, function(proposal, id) {
      if (proposal.proposed_by == persona_id) {
        return proposal;
      }
    });
  },

  // getProposalsBySetting: ["String", ("String")] -> {{Proposal}, {Proposal}}
  //                        Returns all proposals by setting.
  getProposalsBySetting: function(setting_affected) {
    return _.map(this.state.proposals, function(proposal, id) {
      if (_.isEqual(proposal.setting, setting_affected)) {
        return proposal;
      }
      else { return []}
    });
  },

  // getProposalByContent: ["String", ("String")], String/Int -> {Proposal}
  //                        Returns proposals for a setting that have same proposed value.
  getProposalsByContent: function(setting, new_value) {
    return _.map(this.state.proposals, function(proposal, id) {
      if (_.isEqual(proposal.setting, setting) && _.isEqual(proposal.new_value, new_value)) {
        return proposal;
      }
    });
  },

  // findProposal can be given proposal_id, or it can be given a null proposal_id
  // and the proposal's persona_id, setting_affected and new_value.
  findProposal: function (proposal_id, persona_id, setting_affected, new_value) {
    var that = this;
    if (proposal_id === null) { // look up by user, setting and value.
      var user_proposals = this.getProposalsByPersona(persona_id);
      if (_.isEqual(user_proposals, [undefined])) {
        return "No such proposal!"
      }
      else {
        var matches = _.map(user_proposals, function(proposal) {
          if(_.isEqual(setting_affected, proposal.setting) && new_value === proposal.new_value) {
            return proposal;
          }
        });
      }
      if (matches) {
        var proposal_object = {};
        proposal_object[matches[0].id] = matches[0];
        return proposal_object;
      }
      else {
        // Alert: no such proposal
        return "No such proposal!";
      }
    }
    else if (this.state.proposals[proposal_id]) {
      var proposal_object = {};
      proposal_object[proposal_id] = this.state.proposals[proposal_id];
      return proposal_object;
    }
    else {
      // Alert: no such proposal
      return "No such proposal!";
    }
  },

  // getOpenProposals returns all proposals that are both unimplemented and do not have expired: true
  //
  getOpenProposals: function () {
      var unimplemented_open_proposals = _.where(this.state.proposals, {implemented: false, expired: false});
      var provisionally_implemented_open_proposals = _.where(this.state.proposals, {implemented: "provisionally"});
      var all_open_proposals = _.extend(unimplemented_open_proposals, provisionally_implemented_open_proposals);
      return all_open_proposals;
  },

  // getClosedProposals returns all proposals that are either implemented and closed or
  //                    unimplemented and expired.
  getClosedProposals: function () {
      var fully_implemented_proposals = _.where(this.state.proposals, {implemented: true});
      var expired_proposals = _.where(this.state.proposals, {implemented: false, expired: true});
      var all_closed_proposals = _.extend(fully_implemented_proposals, expired_proposals);
      return all_closed_proposals;
  },

  // getOpenProposal is like getOpenProposals except that it provides just the one open proposal regarding the
  //                 setting at issue.
  getOpenProposal: function (setting_object) {
    return (_.where(this.getProposalsBySetting(setting_object), {implemented: false, expired: false})[0]);
  },

  saveChangedProposal: function(proposal) {
    var proposals = this.state.proposals;
    proposals[proposal.id] = proposal;
    if (proposal.implemented) {
      return "Proposal already implemented";
    }
    else {
      this.setState({
        proposals: proposals
      });
      //testProposal
      this.testProposal(proposal.id);
      return "Proposal updated";
    }
  },

  saveNewProposal: function(proposal) {
    var proposals = this.state.proposals;
    proposals[proposal.id] = proposal;
    this.setState({
      proposals: proposals
    });
    return(proposal.id);
  }


});

module.exports = ProposalStore;
