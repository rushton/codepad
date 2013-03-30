
/**
 * Module dependencies.
 */
var express = require('express')
  , routes  = require('./routes')
  , http    = require('http')
  , path    = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/list', routes.list);
app.get('/code', routes.code);

server = http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});

// socket.io binding
var io = require('socket.io').listen(server);

// broadcast code snippet
io.sockets.on('connection', function (socket) {
    socket.on('hash', function(url) {
        socket.join(url);
        socket.set('hash', url);
    });

    socket.on('code', function (data) {
        socket.get('hash', function(err, url) {
            io.sockets.in(url).emit('code',data);
        });
    });
});
