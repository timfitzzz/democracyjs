
'use strict'

// NavBar object

var React = require('react');
var _ = require('underscore');

// NavBar takes the following props:
// -- site_title: String,
module.exports = React.createClass({
  render: function () {
    return (
      <div className="nav navbar navbar-default" role="navigation">
        <div className="container-fluid">
          <div className="navbar-header">
            <button className="navbar-toggle" type="button" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
              <span className="sr-only">
                Toggle Navigation
              </span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">
              {this.props.site_title}
            </a>
          </div>
          <div id="bs-example-navbar-collapse-1" className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
              <li className="active">
                <a href="#">Link</a>
              </li>
              <li>
                <a href="#">Link</a>
              </li>
              <li className="dropdown">
                <a className="dropdown-toggle" href="#" data-toggle="dropdown">
                  Dropdown
                  <b className="caret"></b>
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a href="#">Action</a>
                  </li>
                  <li>
                    <a href="#">Another actionk</a>
                  </li>
                  <li>
                    <a href="#">Something else here</a>
                  </li>
                  <li className="divider"></li>
                  <li><a href="#">One more separated link</a></li>
                </ul>
              </li>
            </ul>
            <form className="navbar-form navbar-left" role="search">
              <div className="form-group">
                <input className="form-control" type="test" placeholder="This Does Nothing Yet" disabled="disabled"></input>
              </div>
              <button className="btn btn-default" type="submit"> Submit</button>
            </form>
            <ul className="nav navbar-nav navbar-right">
              <li>
                <a href="#">Link</a>
              </li>
              <li className="dropdown">
                <a className="dropdown-toggle" href="#" data-toggle="dropdown">Dropdown
                  <b className="caret"></b>
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a href="#">Action</a>
                  </li>
                  <li>
                    <a href="#">Another actionk</a>
                  </li>
                  <li>
                    <a href="#">Something else here</a>
                  </li>
                  <li className="divider"></li>
                  <li><a href="#">One more separated link</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
});
