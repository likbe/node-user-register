var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var logger = require("./loggerService.js").logger;
var User = require('../models/user.js');
var errors = require('./errors.js');

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