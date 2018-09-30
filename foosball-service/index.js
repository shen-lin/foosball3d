var express = require('express');
var proxy = require('http-proxy-middleware');
var https = require('https');
var fs = require('fs');
var app = express();
var axios = require('axios');

// Facebook oauth
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var cookieSession = require('cookie-session');

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
      callbackURL: 'https://localhost:9000/api/login/facebook/return',
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
    res.send('Unauthorized');
  }
}

app.get('/api/whoami', isUserAuthenticated, function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(req.user));
});

// app.get('/api/user/:id/pic', isUserAuthenticated, function(req, res) {
//   var id = req.params.id;
//   var fbPicReqUrl = `http://graph.facebook.com/${id}/picture`;
//   console.log(fbPicReqUrl);
//   axios.get(fbPicReqUrl).then(fbPicRes => {
//     res.setHeader('Content-Type', 'application/octet-stream');
//     res.send(fbPicRes.data);
//   });
// });

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
  target: 'https://localhost:9000',
  changeOrigin: true,
  ws: false,
};
var restProxy = proxy(restOptions);
app.use('/rest', restProxy);

var uiOptions = {
  target: 'https://localhost:3000',
  changeOrigin: true,
  ws: false,
  secure: false,
};
var uiProxy = proxy(uiOptions);
app.use('/', uiProxy);

// Https
var httpsProxyServer = https.createServer(
  {
    key: fs.readFileSync('host.key'),
    cert: fs.readFileSync('host.cert'),
  },
  app,
);

httpsProxyServer.listen(9000, function() {
  console.log('Goto  https://localhost:9000/');
});
