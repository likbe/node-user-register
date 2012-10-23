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
            logger.info('cryptPassword - Hashed password to: ' + hash);
            callback(err, hash)
        });
      }
  });
}