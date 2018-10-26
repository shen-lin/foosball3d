var express = require('express');
var proxy = require('http-proxy-middleware');
var https = require('https');
var http = require('http');
var fs = require('fs');
var app = express();
var axios = require('axios');
var os = require("os");
var hostname = os.hostname();

// Facebook oauth
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var cookieSession = require('cookie-session');
var httpmode = 'http'; // 'https'

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
    keys: ['randomstringhere'],
  }),
);

passport.use(
  new Strategy(
    {
      clientID: '255500021823568',
      clientSecret: '5b135c603602b77edb9d4e153ca4d5c6',
      callbackURL: `//api/login/facebook/return`,
    },
    function(accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    },
  ),
);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

function isUserAuthenticated(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.send(`Unauthorized ${hostname}`);
  }
} 

app.get('/api/whoami', isUserAuthenticated, function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(req.user));
});


app.get('/api/login/facebook', passport.authenticate('facebook'));

app.get(
  '/api/login/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/api/login/facebook' }),
  function(req, res) {
    res.redirect('/');
  },
);

// Proxying
var restOptions = {
  target: `${httpmode}://localhost:9000`,
  changeOrigin: true,
  ws: false,
};
var restProxy = proxy(restOptions);
app.use('/rest', restProxy);

var uiOptions = {
  target: `${httpmode}://localhost:3000`,
  changeOrigin: true,
  ws: false,
  secure: false,
};
var uiProxy = proxy(uiOptions);
app.use('/', uiProxy);

// Https
var httpProxyServer;

if (httpmode === 'https') {
  httpProxyServer = https.createServer(
    {
      key: fs.readFileSync('host.key'),
      cert: fs.readFileSync('host.cert'),
    },
    app,
  );
} else {
  httpProxyServer = http.createServer(app);
}


httpProxyServer.listen(9000, '0.0.0.0', function() {
  console.log(`${httpmode}://localhost:9000/`);
});
