var express = require('express');
var http = require('http');
var path = require('path');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
  
var FACEBOOK_APP_ID = '237220736640204'
var FACEBOOK_APP_SECRET = 'd09d084de0365edb237306bd66cee8d8';

var app = express();

app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
  
var displayName;  
  
passport.use(new FacebookStrategy({  
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  },
  function(token, refreshToken, profile, done) {
    process.nextTick(function() {
    console.log(profile.displayName+' logged in');
	displayName = profile.displayName;
          return done(null, profile );
    });
  }));
  
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/success',
  failureRedirect: '/error'
}));

app.get('/success', function(req, res) {
  res.render('welcome.jade', { title: displayName});
});

app.get('/error', function(req, res, next) {
  res.send("Error logging in.");
});

app.get('/', function(req, res, next) {
  res.render('login.jade');
});

http.createServer(app).listen(app.get('port'), function() {
  console.log('TestApp listening on port ' + app.get('port'));
});