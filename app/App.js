var Marty = require('marty');
Object.byString = require('./helpers/object-bystring.js');

var Application = Marty.createApplication(function () {
  this.register(require('./stores'));
  this.register(require('./actions'));
  this.register(require('./sources'));
});

module.exports = Application;
