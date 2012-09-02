var bcrypt = require("bcrypt");
var uuid = require("uuid-js");
var mongoose = require("mongoose");
var async = require("async");

var User = require('../models/user.js');
var UserActivation = require('../models/userActivation.js');
var account = require('./accountService.js');
var mailService = require('./mailService.js');

exports.registerUser = function(email, firstname, lastname, callback) {
  var userId = new mongoose.Types.ObjectId;
  var user = new User({ _id:userId, email:email, firstname:firstname, lastname:lastname, active:false });
  user.save(function (err) {
      var userActivation = new UserActivation({ activationKey: uuid.create(4), user_id: userId });
      userActivation.save(function(err2) {
        mailService.sendActivationMail(email, firstname, lastname, userActivation.activationKey, function(err3, response) {
          callback(err || err2 || err3, user);
      });
    });
  });
}

exports.findUserByActivationKey = function(activationKey, callback) {
  UserActivation.findOne({activationKey: activationKey}, function(err, result) {
    if (!result) { callback('1'); }
    else {
      User.findOne({_id: result.user_id}, function(err2, user) {
        callback(err || err2, user);
      });
    }
  });
}

exports.activateUser = function(activationKey, password, callback) {
  account.cryptPassword(password, function(err, hash) {
    UserActivation.findOne({activationKey: activationKey}, function(err, userActivation) {
      if (err || !userActivation) { callback(err); }
      else {
        User.findOneAndUpdate({_id: userActivation.user_id}, { $set: { password:hash, active:true } }, { new:true, upsert:false }, function(err, user) {
          if (err || !user) callback(err);
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