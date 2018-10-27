var express = require('express');
var proxy = require('http-proxy-middleware');
var https = require('https');
var http = require('http');
var fs = require('fs');
var app = express();
var axios = require('axios');

// Facebook oauth
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var cookieSession = require('cookie-session');

// Use https for local dev with FB oauth. Otherwise use http for cloud deployments.
const httpmode = process.env.environment ? 'http' : 'https'; 
const host = process.env.host || 'localhost';
const port = process.env.environment ? '443': '9000';

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
    keys: ['randomstringhere'],
  }),
);

passport.use(
  // FB only accepts https callback url.
  new Strategy(
    {
      clientID: '255500021823568',
      clientSecret: '5b135c603602b77edb9d4e153ca4d5c6',
      callbackURL: `https://${host}:${port}/api/login/facebook/return`,
      proxy: true
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
    res.send(`Unauthorized`);
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


// When load for local dev, the UI is hosted on the webpack server. Proxy to the static content.
if (!process.env.environment) {
  var uiOptions = {
    target: `https://localhost:3000`,
    changeOrigin: true,
    ws: false,
    secure: false,
  };
  var uiProxy = proxy(uiOptions);
  app.use('/', uiProxy);
} else {
  app.use(express.static('../foosball-ui/build'));
}


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


httpProxyServer.listen(port, '0.0.0.0', function() {
  console.log(`${httpmode}://${host}:${port}/`);
});
