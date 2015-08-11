var Marty = require('marty');
var ProposalConstants = require('../constants/proposalConstants.js');
var _ = require('underscore');
var Moment = require('moment');

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

  // getProposalsByPersona: (String) -> {{Proposal},{Proposal} ... }
  getProposalsByPersona: function(persona_id) {
    return _.map(this.state.proposals, function(proposal, id) {
      if (proposal.persona_id == persona_id) {
        return proposal;
      }
    });
  },

  // getProposalsBySetting: ["String", ("String")] -> {{Proposal}, {Proposal}}
  getProposalsBySetting: function(setting_affected) {
    return _.map(this.state.proposals, function(proposal, id) {
      if (proposal.setting_affected == setting_affected) {
        return proposal;
      }
    });
  },

  // getProposalByContent: ["String", ("String")], String/Int -> {Proposal}
  getProposalByContent: function(setting_affected, new_value) {
    return _.findWhere(this.state.proposals, {setting_affected: setting_affected, new_value: new_value});
  },

  // findProposal can be given proposal_id, or it can be given a null proposal_id
  // and the proposal's persona_id, setting_affected and new_value.
  findProposal: function (proposal_id, persona_id, setting_affected, new_value) {
    var that = this;
    if (proposal_id == null) { // look up by user, setting and value.
      var user_proposals = getProposalsByPersona(persona_id);
      var match = _.findWhere(user_proposals, {setting_affected: setting_affected, new_value: new_value});
      if (match.length > 0) {
        return match;
      }
      else {
        // Alert: no such proposal
        return undefined;
      }
    }
    else if (this.state.proposal[proposal_id]) {
      var proposal_object = {};
      proposal_object[proposal_id] = this.state.proposal[proposal_id];
      return proposal_object;
    }
    else {
      // Alert: no such proposal
      return undefined;
    }
  },

  // getOpenProposals returns all proposals that are both unimplemented and do not have expired: true
  //
  getOpenProposals: function () {
      return (_.where(this.state.proposals, {implemented: false, expired: false}));
  },

  // getOpenProposal is like getOpenProposals except that it provides just the one open proposal regarding the
  //                 setting at issue.
  getOpenProposal: function (setting_object) {
      return (_.where(this.state.proposals, {implemented: false, expired: false, setting: setting_object}));
  },

  saveChangedProposal: function(proposal) {
    var proposals = this.state.proposals;
    proposals[proposal.id] = proposal;
    if (proposal.implemented) {
      return null;
    }
    else {
      this.setState({
        proposals: proposals
      })
      //testProposal
      testProposal(proposal_id);
    }
  },

  /* Proposal logic functions:

    qualifyProposal: accepts protoproposal --> null:

                  {

                    proposed_by: [persona_id],
                    setting_affected: ["setting", |optional: "groupname"],
                    new_value: String/Int

                  }

     makeProposal: accepts protoproposal --> null:

                  {

                    proposed_by: [persona_id],
                    setting_affected: ["setting", |optional: "groupname"],
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

      testProposal: accepts full proposal object --> null

                    testProposal determines whether proposal should receive implementation,
                    either final or provisional. for now it checks the proposal's
                    consent_percentage against a setting that determines the required consent percentage
                    and if that fails it checks an "optimism" against the set optimism threshhold.

      implementProposal: accepts full proposal object, ["provisional": Boolean] --> null

                    implementProposal

     Diagram: /__docs__/nokings.png

  */

  makeProposal: function(protoproposal) {
    // actually enter proposal into being
    var new_proposal = proposal_object;
    new_proposal[id] = this.state.proposals.length;
    new_proposal[proposed_at] = new Moment;
    new_proposal[current_agreements] = this.app.settingsStore.state.agreements || {};
    new_proposal[current_personas] = this.app.personaStore.state.personas || {};
    new_proposal[amendments] = [];
    new_proposal[consent_percentage = (1/(this.app.personaStore.state.personas.length));
    new_proposal[optimism] = .5; // placeholder, there should be some actual math here
    new_proposal[uninvested_consenters] = [];
    new_proposal[expired] = False;

    // ok now save to state
    saveChangedProposal(new_proposal);
  },

  testProposal: function(proposal_id) {
    var proposal = this.state.proposals[proposal_id];
    // relevant data:
    var propo_optimism = proposal.optimism;                 // proposal's optimism value
    var propo_consent = proposal.consent_percentage;        // proposal's consent value
    var propo_optimism_threshhold = proposal.current_agreements.optimism_threshhold; // optimism_threshhold at time of proposal
    var propo_consent_threshhold = proposal.current_agreements.consent_threshhold; // consent_threshhold at time of proposal
    var propo_time_since_proposed = Moment.duration((new Moment() - proposal.proposed_at);
    //
    // is optimism percentage greater than current_agreements.optimism_threshhold?
    if (propo_optim
        -- if yes: call implementProposal
    -- Q: is initial current consent_percentage > current_agreements.consent_threshhold?
        -- if yes: call implementProposal
        -- if no: set implemented to false
    -- save proposal to state
  },

  implementProposal: function(proposal_id) {

  },


  submitProposal() {

  },

  getProtoproposalHandler: function(protoproposal) {
    //shorten vars
    var proposer = proposal_object.proposed_by;
    var setting = proposal_object.setting_affected;
    var new_value = proposal_object.new_value;
    // does identical proposal exist? (same user, same setting, same new value)
    if (this.findProposal(null, proposer, setting, new_value)) {
      /// if yes: TODO return "Proposal already exists" alert and end
      return [];
    }
    // if no: Q: is there already an open proposal pertinent to same setting?
    var open_setting_propo = this.getOpenProposal(setting);
    if (open_setting_propo) {
      /// if so, is there agreement about the new value?
      if (open_setting_propo.new_value == new_value) {
        //// if so, can the persona participate?
        if (_.contains(open_setting_propo.current_personas, proposer])) {
          ///// if so, the proposer participates in the existing proposal.
          return this.weighInOnProposal; // TODO LOL
        } ///// if not, add persona to uninvested_consenters
        else {
          return this.joinPeanutGalleryOnProposal; // TODO LOL
        }
      }
      /// if not, an amendment is added to the existing proposal
      else {
        return this.addAmendmentToProposal; // TODO LOL
      }
    // if no existing proposal handling, make new proposal.
    } else {
      return(this.makeProposal);
    }
  },

  /*

  //shorten vars
  var proposer = proposal_object.proposed_by;
  var setting = proposal_object.setting_affected;
  var new_value = proposal_object.new_value;
  // does identical proposal exist? (same user, same setting, same new value)
  if (this.findProposal(null, proposer, setting, new_value)) {
    /// if yes: TODO return "Proposal already exists" alert and end
    return [];
  }
  // if no: Q: is there already an open proposal pertinent to same setting?
  var open_setting_propo = this.getOpenProposal(setting);
  if (open_setting_propo) {
    /// if so, is there agreement about the new value?
    if (open_setting_propo.new_value == new_value) {
      //// if so, can the persona participate?
      if (_.contains(open_setting_propo.current_personas, proposer])) {
        ///// if so, the proposer participates in the existing proposal.
        weighInOnProposal(open_setting_propo.id, proposer, "consent"); // TODO LOL
      } ///// if not, add persona to uninvested_consenters
      else {
        joinPeanutGalleryOnProposal(open_setting_propo.id, proposer) // TODO LOL
      }
    }
    /// if not, an amendment is added to the existing proposal
    else {
        addAmendmentToProposal(open_setting_propo.id, proposer, new_value); // TODO LOL
    }
  // if no existing proposal handling, make new proposal.
  } else {
    this.makeProposal(protoproposal);
  }

  */


    //       -- if yes:
      //       -- if yes: Q: is the proposed new value the same?
    //           -- if yes: Q: is proposer in identical proposal's current_personas list?
    //             -- if yes: submit consentToProposal on behalf of user
    //             -- if no: hmm, do nothing for now I guess?
    //       -- if no: proposal becomes an amendment
    //    -- if no: create new proposal
    //       -- record proposed_at: new Moment,
    //       -- save current_agreements
    //       -- save current_personas
    //       -- set amendments: []
    //       -- set initial consent_percentage (1/current_personas.length])
    //       -- set optimism: personas's optimism score, math tbd (default 50%)
    //       -- set uninvested_consenters
    //       -- Q: is optimism percentage greater than current_agreements.optimism_threshhold?
    //           -- if yes: call implementProposal
    //       -- Q: is initial current consent_percentage > current_agreements.consent_threshhold?
    //           -- if yes: call implementProposal
    //           -- if no: set implemented to false
    //       -- save proposal to state
    // */

  joinPeanutGalleryOnProposal: function(protoproposal) {

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
