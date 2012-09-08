var User = require('../models/user.js');
var UserActivation = require('../models/userActivation.js');
var register = require('../apis/registerService.js');
var errors = require('./errors.js');

exports.index = function(req, res) {
   res.render('register', {user : null});
}

exports.registerUser = function(req, res) {
  register.registerUser(req.body.email, req.body.firstname, req.body.lastname, function(err) 
  {
    if (err) res.end('unable to register the user');
    res.redirect('/');  
  });
}

exports.activate = function(req, res) {
  register.findUserByActivationKey(req.params.activationKey, function (err, user) {
    if (err) { res.render('activate', { user: null, error: err }); }
    else res.render('activate', { user : user, activationKey : req.params.activationKey });    
  });
}

exports.activateUser = function(req, res) {
  register.activateUser(req.body.activationKey, req.body.password, function(err, user) {
    if (err) { 
      logger.info('activateUser - Unable to activate user using activation key:' + req.body.activationKey);
      res.render('greetings', { error : err}); 
    }
    else { res.render('greetings', {user : user}); }
  });
}

exports.desactivateUser = function(req, res) {
  register.desactivateUser(req.params.activationKey, function(err, user) {
    if (err) res.end('unable to desactivate user');
    else res.redirect('/users');
  });
}

exports.listUsers = function(req, res) {
  register.findUsersWithActivationKeys(function (err, usersWithUserActivations)
  {
    if (err) res.end('unable to list users');
    else res.render('users', {usersWithUserActivations: usersWithUserActivations});
  });
}

exports.resendActivationLink = function(req, res) {
  register.resendActivationLink(req.body.email, function(err, user) {
    if (!err) { 
      res.render('activationResent', {user : user});
    }
    else if (err == errors.UNABLE_TO_FIND_USER_TO_RESEND_MAIL) {
      res.render('register', {user : { email:req.body.email, status:'NoAccountForGivenEmail'  }});
    }
    else {
      logger.error('resendActivationLink - user: ' + user.email + ' exist. But resend failed with error: ' + err);
      res.end('We are unable to resend your activation key. Our support service will contact you as soon as possible.');
    }
  });
}
