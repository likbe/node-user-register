var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var logger = require("./loggerService.js").logger;
var User = require('../models/user.js');
var errors = require('./errors.js');
var accountService = require('./accountService.js');
var cryptographicService = require('./cryptographicService.js');


exports.validatePassword = function(login, password, callback) {
   accountService.findUserByEmail(login, function(err, user) {
      if  (err || !user) { logger.info('validatePassword - Could not find user'); callback(errors.INVALID_PASSWORD_USER_DOES_NOT_EXIST, null); }
      else {
        if (!user.active) {
          logger.info('validatePassword - User ' + user.email + ' is not active');
          callback(errors.INVALID_PASSWORD_USER_IS_NOT_ACTIVE, null);
        }
        else {
          bcrypt.compare(password, user.password, function(err, isPasswordMatch) {
            if (!isPasswordMatch) { 
              logger.log('info','validatePassword - Password does not match for user : ' + user.email); 
              callback(errors.INVALID_PASSWORD_PASSWORD_DOES_NOT_MATCH, null); 
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

exports.changePassword = function(login, actualPassword, newPassword, confirmPassword, callback) {
  if (newPassword != confirmPassword) {
    logger.info('changePassword - User:' + login.toLowerCase() + ' cannot be changed because new password does not match its confirmation');
      callback(errors.CHANGE_PASSWORD_CONFIRMATION_DOES_NOT_MATCH, null);
  }
  else
  {
    this.validatePassword(login, actualPassword, function(err, user) {
      if (err == errors.INVALID_PASSWORD_PASSWORD_DOES_NOT_MATCH) {
        logger.info('changePassword - User:' + login.toLowerCase() + ' authentication failed due to actual password mismatch');
        callback(errors.INVALID_PASSWORD_PASSWORD_DOES_NOT_MATCH, null);
      }
      else {
        accountService.findUserByEmail(login, function(err, user) {
            cryptographicService.cryptPassword(newPassword, function(err2, hash) {
            User.update({email:login}, {$set: {password:hash}}, function(err3) {
                logger.info('changePassword - User:' + login.toLowerCase() + ' \'s password is now changed');
                accountService.findUserByEmail(login, function(err, user) {
                  callback(err || err2 || err3, user);
                });
            });
          });
        }); 
      }
    });
  }
}