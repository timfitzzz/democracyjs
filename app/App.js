var Marty = require('marty');

var Application = Marty.createApplication(function () {
  this.register(require('./stores'));
  this.register(require('./actions'));
});

module.exports = Application;
