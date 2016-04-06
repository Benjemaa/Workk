var passport = require('passport');
var Account = require('../models/account');
var Message = require('../models/messages');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    console.log(req.user);
    res.render('index', { user : req.user });
});

router.get('/register', function(req, res) {
    res.render('register');
});

router.post('/register', passport.authenticate('local-signup', {failureRedirect : '/register', // redirect back to the signup page if there is an error
    }),
    function(req, res) {
      //  res.json(req.user);
       res.render('completeRegister', { user : req.user });
    });

    router.get('/completeRegister', function(req, res) {
        res.render('completeRegister');
    });

    router.post('/completeRegister',
        function(req, res) {
          var user = req.user;
          user.local.email = req.body.email;
          user.save();
          //  res.json(req.user);
           res.render('profile', { user : req.user });
        });


router.get('/login', function(req, res) {
    res.render('login');
});

router.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
    }));

router.get('/profile', function(req, res) {
    res.render('profile', { user : req.user });
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/auth/linkedin', passport.authenticate('linkedin'));

router.get('/auth/linkedin/callback',
  passport.authenticate('linkedin', { failureRedirect: '/' }),
  function(req, res) {
    //  res.json(req.user);
     res.render('profile', { user : req.user });
  });

  router.get('/connect/linkedin', passport.authorize('linkedin'));

          // handle the callback after twitter has authorized the user
  router.get('/connect/linkedin/callback',
              passport.authorize('linkedin', {failureRedirect : '/'}),
              function(req, res) {
                      res.render('profile', { user : req.user });
                    }
            );

  router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
  router.get('/auth/facebook/callback',
      passport.authenticate('facebook', { failureRedirect : '/' }),
      function(req, res) {
         res.render('profile', { user : req.user });
      });

  router.get('/connect/facebook', passport.authorize('facebook'));

          // handle the callback after twitter has authorized the user
  router.get('/connect/faceboook/callback',
              passport.authorize('facebook', {failureRedirect : '/'}),
              function(req, res) {
                      res.render('profile', { user : req.user });
                    }
            );

    router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    router.get('/auth/google/callback',
            passport.authenticate('google', { failureRedirect : '/'}),
            function(req, res) {
              // Successful authentication
              //  res.json(req.user);
               res.render('profile', { user : req.user });
            });

    router.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

            // handle the callback after twitter has authorized the user
    router.get('/connect/google/callback',
                passport.authorize('google', {failureRedirect : '/'}),
                function(req, res) {
                        res.render('profile', { user : req.user });
                      }
              );

    router.get ('/setting',function(req,res) {
      res.render('setting', { user : req.user });
    });
    router.get ('/profileModif',function(req,res) {
      res.render('profileModif', { user : req.user });
    });

    router.post('/modifAccount',function(req,res){
      var user =req.user;
      if (req.body.localName != user.local.username){
        user.local.username = req.body.localName;
      }
      if (req.body.localEmail != user.local.email){
        user.local.email = req.body.localEmail;
      }
      user.save();
      //  res.json(req.user);
       res.render('profile', { user : req.user });
    });
router.get('/messages',function(req,res) {
    Message.find({},function(err,messages){
      if (err) return err;
      var messagesto =[];
      var messagesfrom = [];
      var t=0;
      var f=0;

      messages.forEach(function(message){
        if (message.from === req.user.username){
          var i=0;
          while ((i < t) && (messagesto[i].to !== message.to))
            {
              i++
            }
              console.log('from'+i +'/'+ t);
            if (i === t){
              messagesto[t] = message;
              t++;
            }
          }
        if (message.to === req.user.username){
            var j=0;
            while ((j<f)&&(messagesfrom[j].from !== message.from))
            {
              j++;
            }
            if (j === f){
              messagesfrom[f] = message;
              f++;
            }
          }
      });
      var x=t;
      if (messagesto[0]){
      for (var i=0;i<x;i++){
        var j=0;
        while ((j<=i)&&(messagesfrom[j].to !== messagesto[i].from)){
          j++;
          }
          if (j > i)
          {
            messagesto[t]=messagesfrom[j];
            t++;
          }
        }
      }else{
          for (var i=0;i<f;i++){
            messagesto[i]=messagesfrom[i];
          }
      }
        var messageWith = messagesto[0];

      res.render('message', { user : req.user , messages :messages ,messagesto : messagesto ,messageWith : messageWith});
    });
  });


router.post('/sendMessage',function(req,res){
  var message = new Message();
  message.from = req.user.username;
  message.to = req.body.messageto;
  message.contain = req.body.message;
  message.date = new Date();
  message.save();
  res.redirect('/messages');
});

module.exports = router;
