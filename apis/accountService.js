var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var logger = require("./loggerService.js").logger;
var User = require('../models/user.js');


exports.cryptPassword = function(password, callback) {
   bcrypt.genSalt(10, function(err, salt) {
    if (err) callback(err);
      else {
        bcrypt.hash(password, salt, function(err, hash) { 
          if (err) {
            logger.error('cryptPassword - Failed to hash password');
           callback(err);
           }
          else {
            logger.info('cryptPassword - Hashed password to: ' + hash);
            callback(null, hash)
          }
      });
      }
  });
}

exports.validatePassword = function(login, password, callback) {
   this.findUserByEmail(login, function(err, user) {
   		if  (err || !user) { logger.info('validatePassword - Could not find user'); callback(1, null); }
   		else {
        if (!user.active) {
          logger.info('validatePassword - User ' + user.email + ' is not active');
          callback(2, null);
        }
        else {
   		    bcrypt.compare(password, user.password, function(err, isPasswordMatch) {
   		     	if (!isPasswordMatch) { 
              logger.log('info','validatePassword - Password does not match for user : ' + user.email); 
              callback(3, null); 
            }
   			    else { 
              logger.info('validatePassword - Authentication succeed for user : ' + user.email); 
              callback(null, user);
           }
   		    });
       }
   		}
   });
}

exports.findUserByEmail = function(email, callback) {
  User.findOne({email: email}, function(err, user) {
    if (err || !user) { 
      logger.info('findUserByEmail - Cannot found user for Email: ' + email); 
      callback(1, null); }
    else { 
      logger.info('findUserByEmail - Found user: ' + user.email + ' for Email:' + email); 
      callback(null, user); 
    }
  });
}

exports.findUserById = function(id, callback) {
  User.findOne({_id: id}, function(err, user) {
    if (err || !user) { 

      callback(1, null); }
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

exports.logout = function(user, callback) {
  callback(true);
}
