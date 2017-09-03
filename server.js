var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('./config');
var app = express();
var googleProfile = {};

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new GoogleStrategy({
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret:config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, cb) {
        process.nextTick(function() {
            console.log('profile', profile)
            googleProfile = {
                id: profile.id,
                displayName: profile.displayName,
                gender: profile.gender,
                email: profile.emails[0].value,
                photo: profile.photos[0].value
            };
            cb(null, profile);
        })
    }
));

app.set('view engine', 'pug');
app.set('views', './views');
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res){
    res.render('index.pug', {header: 'Zaloguj się', user: req.id});
});

app.get('/logged', function(req, res){
    res.render('logged', {header: 'Jesteś zalogowany', user: googleProfile  });
});

app.get('/auth/google',
    passport.authenticate('google', {
    scope : ['profile', 'email']
}));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect : '/logged',
        failureRedirect: '/'
    }));

app.listen(3000);