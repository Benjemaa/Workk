
var passport = require('passport');
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var LinkedInStrategy = require('passport-linkedin');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// load up the user model
var User = require('../models/account');
var config = require('./linkedid');
var init = require('./init');
var configAuth = require('./facebookid');
var configAuthG = require('./googleId');
// load the auth variables
// =========================================================================
// LinkedIn ================================================================
// =========================================================================
passport.use(new LinkedInStrategy({
    consumerKey: config.linkedin.clientID,
    consumerSecret: config.linkedin.clientSecret,
    callbackURL: config.linkedin.callbackURL,
    scope : config.linkedin.scope,
    passReqToCallback : true,
    profileFields: ['id', 'first-name', 'last-name', 'email-address','location','picture-url','public-profile-url','headline','industry','current-share','num-connections','summary','specialties']
// }, function(Token, tokenSecret, profile, done) {
//  // asynchronous verification, for effect...
//  process.nextTick(function () {
//    // To keep the example simple, the user's LinkedIn profile is returned to
//    // represent the logged-in user. In a typical application, you would want
//    // to associate the LinkedIn account with a user record in your database,
//    // and return that user instead.
//    return done(null, profile);
// });
},
  // linkedin sends back the tokens and profile info
  function(req,token, refreshtoken, profile, done) {
    process.nextTick(function() {
    if (!req.user){
      User.findOne({ 'linkedin.id' : profile.id },
       function(err, user) {
                            if (err) {
                              return done(err);
                            }
                            if (user){
                              return done(null,user);
                            } else {
                              User.findOne({'username' :profile.displayName},
                              function(err,user){
                                                if (err) return done (err);
                                                if (!user){
                                                            var newUser = new User();
                                                            newUser.username = profile.displayName;
                                                            newUser.linkedin.id= profile.id;
                                                            newUser.linkedin.firstName= profile._json.firstName;
                                                            newUser.linkedin.lastName = profile._json.lastName;
                                                            newUser.linkedin.pictureUrl= profile._json.pictureUrl;
                                                            newUser.linkedin.emailAddress = profile._json.emailAddress;
                                                            newUser.linkedin.linkedinProfile = profile._json.publicProfileUrl;
                                                            newUser.linkedin.country = profile._json.location.name;
                                                            newUser.linkedin.headline =profile._json.headline;
                                                            newUser.linkedin.industry=profile._json.industry;
                                                            newUser.linkedin.currentShare = profile._json.currentShare.comment;
                                                            newUser.linkedin.numConnections = profile._json.numConnections;
                                                            newUser.linkedin.summary= profile._json.summary;
                                                            newUser.linkedin.specialties= profile._json.specialties;
                                                            newUser.save(function(err) {
                                                            if (err)
                                                                throw err;
                                                              // if successful, return the new user
                                                              return done(null, newUser);
                                                            });
                                                          }
                                                  return done(null,null);
                                                });
                                    }
                                });
      }else{
        User.findOne({ 'linkedin.id' : profile.id },
         function(err, user) {
           if (err) return done(err);
           if (user) return done(null,null);
            var user = req.user; // pull the user out of the session
            // update the current users facebook credentials
            user.linkedin.id= profile.id;
            user.linkedin.firstName= profile._json.firstName;
            user.linkedin.lastName = profile._json.lastName;
            user.linkedin.pictureUrl= profile._json.pictureUrl;
            user.linkedin.emailAddress = profile._json.emailAddress;
            user.linkedin.linkedinProfile = profile._json.publicProfileUrl;
            user.linkedin.country = profile._json.location.name;
            user.linkedin.headline =profile._json.headline;
            user.linkedin.industry=profile._json.industry;
            user.linkedin.currentShare = profile._json.currentShare.comment;
            user.linkedin.numConnections = profile._json.numConnections;
            user.linkedin.summary= profile._json.summary;
            user.linkedin.specialties= profile._json.specialties;
            // save the user
            user.save(function(err) {
                if (err)
                    throw err;
                return done(null, user);
            });
          });
        }
    });
  }));
  // =========================================================================
  // Local ================================================================
  // =========================================================================
// passport.use (new LocalStrategy({
//
// }));

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
passport.use(new FacebookStrategy({
    // pull in our app id and secret from our auth.js file
    clientID        : configAuth.facebookAuth.clientID,
    clientSecret    : configAuth.facebookAuth.clientSecret,
    callbackURL     : configAuth.facebookAuth.callbackURL
    // }, function(Token, tokenSecret, profile, done) {
    //  // asynchronous verification, for effect...
    //  process.nextTick(function () {
    //    // To keep the example simple, the user's LinkedIn profile is returned to
    //    // represent the logged-in user. In a typical application, you would want
    //    // to associate the LinkedIn account with a user record in your database,
    //    // and return that user instead.
    //    return done(null, profile);
    //  });
    // facebook will send back the token and profile
    },
    function(req,Token, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function() {
          if (!req.user){
            User.findOne({ 'facebook.id' : profile.id },
             function(err, user) {
                                  if (err) {
                                    return done(err);
                                  }
                                  if (user){
                                    return done(null,user);
                                  } else {
                                    User.findOne({'username' :profile.displayName},
                                    function(err,user){
                                                      if (err) return done (err);
                                                      if (!user){
                                                                  var newUser = new User();
                                                                  newUser.username = profile.displayName;
                                                                  newUser.facebook.id= profile.id;
                                                                  newUser.facebook.username= profile.displayName;
                                                                  newUser.save(function(err) {
                                                                  if (err)
                                                                      throw err;
                                                                    // if successful, return the new user
                                                                    return done(null, newUser);
                                                                  });
                                                                }
                                                        return done(null,null);
                                                      });
                                          }
                                      });
            }else{
              User.findOne({ 'facebook.id' : profile.id },
               function(err, user) {
                 if (err) return done(err);
                 if (user) return done(null,null);
                  var user = req.user; // pull the user out of the session
                  // update the current users facebook credentials
                  user.facebook.id= profile.id;
                  user.facebook.username= profile.displayName;
                  // save the user
                  user.save(function(err) {
                      if (err)
                          throw err;
                      return done(null, user);
                  });
                });
              }
          });
}));


    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.username' : username }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);
            // check to see if theres already a user with that email
            if (user) {
                return done(null);
            } else {
                // if there is no user with that email
                // create the user
                var newUser            = new User();
                // set the user's local credentials
                newUser.local.username = username;
                newUser.local.password = password;
                newUser.username = username;
                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });

        });
    }));

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with email and password from our form
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.username' :  username }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);
            // if no user is found, return the message
            if (!user)
                return done(null);
            // if the user is found but the password is wrong
            // all is well, return successful user
            return done(null, user);
        });

    }));

    passport.use(new GoogleStrategy({
            clientID        : configAuthG.googleAuth.clientID,
            clientSecret    : configAuthG.googleAuth.clientSecret,
            callbackURL     : configAuthG.googleAuth.callbackURL,
        },
        function(req,token, refreshToken, profile, done) {
            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Google
            process.nextTick(function() {
              if (!req.user){
                // try to find the user based on their google id
                User.findOne({ 'google.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        // if a user is found, log them in
                        return done(null, user);
                    } else {
                      User.findOne({'username':profile.displayName},function(err,user){
                        if (err) return done(err);
                        if (user) {
                          return done(null);
                        }else{
                        // if the user isnt in our database, create a new user
                        var newUser          = new User();
                        // set all of the relevant information
                        newUser.username     = profile.displayName;
                        newUser.google.id    = profile.id;
                        newUser.google.token = token;
                        newUser.google.name  = profile.displayName;
                        newUser.google.email = profile.emails[0].value; // pull the first email
                        // save the user
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                      }
                      });
                    }
                });
              }else {
                User.findOne({ 'google.id' : profile.id },
                 function(err, user) {
                   if (err) return done(err);
                   if (user) return done(null,null);
                   var user = req.user;
                   user.google.id= profile.id;
                   user.google.token = token;
                   user.google.name  = profile.displayName;
                   user.google.email = profile.emails[0].value;
                   user.save(function(err) {
                   if (err)
                        throw err;
                    return done(null, user);
                });
              });
              }
            });
        }));

init();
module.exports = passport;
