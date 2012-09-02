var User = require('../models/user.js');
var UserActivation = require('../models/userActivation.js');
var register = require('../apis/registerService.js');

exports.index = function(req, res) {
   res.render('register');
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
    if (err) { res.end('Error while finding activation key : ' + req.params.activationKey); }
    else res.render('activate', { user : user, activationKey : req.params.activationKey });    
  });
}

exports.activateUser = function(req, res) {
  register.activateUser(req.body.activationKey, req.body.password, function(err, user) {
    if (err) res.end('unable to get user from userid / userActivation');
    else res.render('greetings', {user : user});
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
