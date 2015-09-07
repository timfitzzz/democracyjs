'use strict'
/* global require */

/*         <ProgressBar max={proposal.current_agreements.consent_threshhold.value} now={proposal.consent_percentage} label={"%(now)s/%(max)s"}/>
*/

var Panel = require('react-bootstrap').Panel;
var _ = require('underscore');
var ProgressBar = require('react-bootstrap').ProgressBar;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var ButtonGroup = require('react-bootstrap').ButtonGroup;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Button = require('react-bootstrap').Button;

var ProposalList = React.createClass({

  displayName: "ProposalList",

  renderProgressBar: function(percentage, threshhold) {
    if (percentage >= threshhold) {
      return(<ProgressBar>
                <ProgressBar
                  bsStyle='success'
                  now={percentage*100}
                  label={percentage*100 + "/" + threshhold*100}
                />
            </ProgressBar>)
    }
    else {
      return (<ProgressBar>
                <ProgressBar
                  bsStyle='warning'
                  now={percentage*100}
                  label={percentage*100 + "/" + threshhold*100}
                />
              </ProgressBar>)
    }
  },

  stringifySettingArray: function(setting_array) {
    var setting_string = "";
    _.each(setting_array, function(setting) {
      setting_string = setting_string+setting+".";
    });
    setting_string = setting_string.substr(0, setting_string.length-1);
    console.log(setting_string);
    return setting_string;
  },

  registerAction: function(action_string, proposal_id) {
    var that = this;
    var action_handlers = {
      "consent": function(proposal_id) {
        that.context.app.proposalActionCreators.consentToProposal(proposal_id);
      }
    };
    return function(){ action_handlers[action_string](proposal_id) };
  },

	render: function() {
		var that = this;
    if (_.size(this.props.open_proposals) > 0) {
      var rendered_open_proposals = this.props.open_proposals.map(function(proposal) {
        var setting_string = that.stringifySettingArray(proposal.setting);
        return (<Panel key={proposal.id}>
          {that.stringifySettingArray(proposal.setting)}<br/>
        old: {proposal.old_value}<br/>
          new: {proposal.new_value}
          {that.renderProgressBar(proposal.consent_percentage, proposal.current_agreements.consent_threshhold.value)}
          <ButtonToolbar>
         <ButtonGroup>
           {/*<Button><Glyphicon glyph='unchecked' /></Button>*/}
           <Button><Glyphicon glyph='check' onClick={that.registerAction("consent", proposal.id)} /></Button>
           <Button><Glyphicon glyph='stop'  onClick={that.registerAction("block", proposal.id)}/></Button>
           <Button><Glyphicon glyph='comment' onClick={that.registerAction("comment", proposal.id)} /></Button>
         </ButtonGroup>
       </ButtonToolbar>
        </Panel>)
      });
    }
    else {
      var rendered_open_proposals = "No open proposals."
    }
    if (_.size(this.props.closed_proposals) > 0) {
      var rendered_closed_proposals = this.props.closed_proposals.map(function(proposal) {
        var setting_string = that.stringifySettingArray(proposal.setting);
        return (<Panel key={proposal.id}>
          {that.stringifySettingArray(proposal.setting)}<br/>
        old: {proposal.old_value}<br/>
          new: {proposal.new_value}
          {that.renderProgressBar(proposal.consent_percentage, proposal.current_agreements.consent_threshhold.value)}
        </Panel>)
      })
    }
    else {
      var rendered_closed_proposals = "No closed proposals."
    }
		return (<Panel>
      Open Proposals: <br></br>
      {rendered_open_proposals}
      <hr/>
      Closed Proposals: <br></br>
      {rendered_closed_proposals}
		</Panel>);
  }
});


module.exports = Marty.createContainer(ProposalList, {
  listenTo: ["proposalStore"],
  fetch: {
    open_proposals: function() {
      return this.app.proposalStore.getOpenProposals();
    },
    closed_proposals: function() {
      return this.app.proposalStore.getClosedProposals();
    }
  }
});
