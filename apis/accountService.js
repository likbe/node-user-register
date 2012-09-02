var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var User = require('../models/user.js');

exports.cryptPassword = function(password, callback) {
   bcrypt.genSalt(10, function(err, salt) {
    if (err) callback(err);
      else {
        bcrypt.hash(password, salt, function(err, hash) { 
          if (err) callback(err);
          else callback(null, hash)
      });
      }
  });
}

exports.validatePassword = function(login, password, callback) {
  // todo log something
   this.findUserByEmail(login, function(err, user) {
   		if  (err || !user) { callback(1, null); }
   		else {
        if (!user.active) {
          callback(2, null);
        }
        else {
   		    bcrypt.compare(password, user.password, function(err, isPasswordMatch) {
   		     	if (!isPasswordMatch) { callback(3, null); }
   			    else { callback(null, user); }
   		    });
       }
   		}
   });
}

exports.findUserByEmail = function(email, callback) {
  User.findOne({email: email}, function(err, user) {
    if (err || !user) { callback(1, null); }
    else { callback(null, user); }
  });
}

exports.findUserById = function(id, callback) {
  User.findOne({_id: id}, function(err, user) {
    if (err || !user) { callback(1, null); }
    else { callback(null, user); }
  });
}

exports.login = function(id, callback) {
  // todo log something
  this.findUserById(id, function(err, user) {
    callback(err, user);
  });
}

exports.logout = function(user, callback) {
  // todo log something
  callback(true);
}
