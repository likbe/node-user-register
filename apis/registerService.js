var bcrypt = require("bcrypt");
var uuid = require("uuid-js");
var mongoose = require("mongoose");
var async = require("async");
var S = require("string");

var User = require('../models/user.js');
var UserActivation = require('../models/userActivation.js');
var account = require('./accountService.js');
var passwordService = require('./passwordService.js');
var mailService = require('./mailService.js');
var logger = require("./loggerService.js").logger;
var errors = require("./errors.js");
var cryptographicService = require("./cryptographicService.js");


exports.registerUser = function(email, firstname, lastname, callback) {
  account.exists(email, function(err, exists) {
    if (exists) {
      logger.info('registerUser - User:' + email + ' already exists');
      callback(errors.USER_ALREADY_EXISTS, null);
    }
    else {
      logger.info('registerUser - User:' +  email.toLowerCase() + ' does not already exists');
      var userId = new mongoose.Types.ObjectId;
      var user = new User({ _id:userId, email:email.toLowerCase(), firstname:S(firstname).capitalize().s, lastname:lastname.toUpperCase(), active:false });
      user.save(function (err) {
          var userActivation = new UserActivation({ activationKey: uuid.create(4), user_id: userId });
          userActivation.save(function(err2) {
            mailService.sendActivationMail(user.email, user.firstname, user.lastname, userActivation.activationKey, function(err3, response) {
              callback(err || err2 || err3, user);
          });
        });
      });
    }
  });
}

exports.findUserByActivationKey = function(activationKey, callback) {
  UserActivation.findOne({activationKey: activationKey}, function(err, result) {
    if (!result) { logger.info('findUserByActivationKey - Unable to find activationKey:' + activationKey); callback('1'); }
    else {
      logger.info('findUserByActivationKey - Found activationKey: ' + activationKey);
      User.findOne({_id: result.user_id}, function(err2, user) {
        logger.info('findUserByActivationKey - Found user: ' + user.email + ' from activationKey: ' + activationKey)
        callback(err || err2, user);
      });
    }
  });
}

exports.activateUser = function(activationKey, password, callback) {
  cryptographicService.cryptPassword(password, function(err, hash) {
    UserActivation.findOne({activationKey: activationKey}, function(err, userActivation) {
      if (err || !userActivation) { callback(err); }
      else {
        User.findOneAndUpdate({_id: userActivation.user_id}, { $set: { password:hash, active:true, roles: [{name:'workspaceCreator'}] } }, { new:true, upsert:false }, function(err, user) {
          if (err || !user) callback(err, null);
          else callback(null, user);
        });
      }
    });
  });
}

exports.desactivateUser = function(activationKey, callback) {
  UserActivation.findOne({activationKey: activationKey}, function(err, userActivation) {
    if (err || !userActivation) { callback(err); }
    else {
        User.findOneAndUpdate({_id: userActivation.user_id}, { $set: { active:false } }, { new:true, upsert:false }, function(err, user) {
          if (err || !user) callback(err);
          else callback(null, user);
      });
    }
  });
}

exports.findUsersWithActivationKeys = function(callback) {
  var result = [];
  UserActivation.find({}, function(err, userActivations) {
    async.forEach(userActivations, function(userActivation, callback) {
      User.findOne({_id:userActivation.user_id}, function(err, user) {
      result.push({user: user, userActivation: userActivation});
      callback(null);
    });
    }, function(err) {
      callback(null, result);
    });
  });
}

exports.findActivationKeyByUserId = function(userId, callback) {
  UserActivation.findOne({user_id: userId}, function(err, activationKey) {
    callback(err, activationKey);
  });
}

exports.resendActivationLink = function(email, callback) {
  logger.info('resendActivationLink - Try to resend activation link to user:' + email);
  account.findUserByEmail(email, function(err, user) {
    if (!user) { callback(errors.UNABLE_TO_FIND_USER_TO_RESEND_MAIL, null); }
    else {
      module.exports.findActivationKeyByUserId(user._id, function(err, activationKey) {
        mailService.sendActivationMail(email, user.firstname, user.lastname, activationKey, function(err, response) {
          callback(err, user);
        });
      });
    }
  });
}