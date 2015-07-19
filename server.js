var express = require('express');
var path = require('path');
var httpProxy = require('http-proxy');
var http = require('http');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  ws: true
});
var app = express();
var isProduction = false;
var port = isProduction ? process.env.PORT : 3000;
var publicPath = path.resolve(__dirname, 'public');



var routes = require('./server/routes/index');
var users = require('./server/routes/users');
var tweets = require('./server/routes/tweets');
var events = require('./server/routes/events');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(publicPath));

// catch 404 and forward to error handler
/* app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
}); */

app.all('/db/*', function (req, res) {
  proxy.web(req, res, {
    target: 'https://glowing-carpet-4534.firebaseio.com/'
  });
});

app.all("/api/*", function(req, res, next) {
  if (req.method.toLowerCase() !== "options") {
    return next();
  }
  return res.send(204);
});

app.use('/users', users);


if (!isProduction) {

  var bundle = require('./server/bundle.js');
  bundle();
  app.all('/assets/*', function (req, res) {
    proxy.web(req, res, {
        target: 'http://127.0.0.1:3001'
    });
  });
  app.all('/socket.io*', function (req, res) {
    proxy.web(req, res, {
      target: 'http://127.0.0.1:3001'
    });
  });


  proxy.on('error', function(e) {
    // Just catch it
  });

  // We need to use basic HTTP service to proxy
  // websocket requests from webpack
  var server = http.createServer(app);

  server.on('upgrade', function (req, socket, head) {
    proxy.ws(req, socket, head);
  });

  server.listen(port, function () {
    console.log('Server running on port ' + port);
  });

} else {

  // And run the server
  app.listen(port, function () {
    console.log('Server running on port ' + port);
  });

}
