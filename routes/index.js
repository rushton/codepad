
/*
 * GET home page.
 */
var qs      = require('querystring')
    ,url    = require('url')
    ,qs     = require('querystring')
    ,hash   = require('../util/shorturl.js')
    ,github = require('octonode');

// Build the authorization config and url
var auth_url = github.auth.config({
  id: '6ee8779ebd3951a74701',
  secret: 'd17e47194fe99e88d714fec35e38fc7448a9faf5'
}).login(['user', 'repo', 'gist']);

exports.index = function(req, res) {
  var shortUrl = hash.getShortUrl();
  res.render('index', {url: shortUrl});

  //res.writeHead(301, {'Content-Type': 'text/plain', 'Location': auth_url})
  //res.end('Redirecting to ' + auth_url);
};

exports.list = function(req,res) {
  uri = url.parse(req.url);
  uriParams = qs.parse(uri.query);

  github.auth.login(uriParams.code, function (err, token) {
      var client = github.client(token);
      var ghgist = client.gist();

      // feed all gists to the view
      ghgist.user(uriParams.username, function(err, s, b) {
          res.render('list', {gists:s});
      });

  });
}

exports.code = function(req,res) {
  var shortUrl = hash.getShortUrl();
  res.render('coder', {hash: shortUrl});
}

exports.observe = function(req,res) {
  res.render('observer', {hash: req.params.hash});
}
