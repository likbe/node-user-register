var mongoose = require("mongoose");
var logger = require("./loggerService.js").logger;
var User = require('../models/user.js');
var errors = require('./errors.js');

exports.findUserByEmail = function(email, callback) {
  User.findOne({email: new RegExp('^'+email+'$', "i")}, function(err, user) {
    if (err || !user) { 
      logger.info('findUserByEmail - Cannot found user for Email: ' + email); 
      callback(errors.COULD_NOT_FIND_USER_BY_EMAIL, null); }
    else { 
      logger.info('findUserByEmail - Found user: ' + user.email + ' for Email:' + email); 
      callback(null, user); 
    }
  });
}

exports.findUserById = function(id, callback) {
  User.findOne({_id: id}, function(err, user) {
    if (err || !user) { 
      callback(errors.COULD_NOT_FIND_USER_BY_ID, null); }
    else { callback(null, user); }
  });
}

exports.login = function(id, callback) {
  this.findUserById(id, function(err, user) {
    if (!user)  { 
      logger.info('login - Cannot found user for Id: ' + id); 
    }
    else 
    {
      logger.info('login - Found user: ' + user.email + ' for Id: ' + id);
      callback(err, user);
    }
  });
}

exports.exists = function(email, callback) {
  this.findUserByEmail(email, function(err, user) {
    if (err || !user) { callback(err, false); }
    else { callback(err, true); }
  });
}

exports.logout = function(user, callback) {
  callback(true);
}