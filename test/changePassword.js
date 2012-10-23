var assert = require("assert");
var should = require("should");
var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var registerService = require('../apis/registerService.js');
var passwordService = require('../apis/passwordService.js');
var cryptographicService = require('../apis/cryptographicService.js');
var errors = require('../apis/errors.js');

var User = require('../models/user.js');
var UserActivation = require('../models/userActivation.js');



var conn;

function initializeUser(cb) {
	var userId = new mongoose.Types.ObjectId;
	conn = mongoose.connect('mongodb://localhost/likbe-test');
	var email = "john.doe@fake.com", firstname="John", lastname = "Doe";
	var user = new User({ _id:userId, email:email, firstname:firstname, lastname:lastname, active:false });
	User.remove(function() {
		UserActivation.remove(function() {
			user.save(function (err) {
				var userActivation = new UserActivation({ activationKey: 'fb6b4c32-7a2c-407e-b69e-9b6df92c71d5', user_id: userId });
				userActivation.save(function(err) {
					registerService.activateUser('fb6b4c32-7a2c-407e-b69e-9b6df92c71d5', 'password', function(err, res) {										
						if (err) cb(err, res);
						else cb(null, res);
					});
				});
			});
		});
	});		
}
	

function closeConnection() {
	mongoose.disconnect();
}

describe('Change password', function() {
	var currentUser;
	var currentUserUpdated;
	var password1 = false;
	var password2 = false;

	describe('with correct actual password and a matching password and confirmation', function() {
		before(function(done) {
			initializeUser(function (err, user) {
				currentUser = user;
				 passwordService.changePassword(user.email, 'password', 'newpassword', 'newpassword', function(err, user2) {
				 	currentUserUpdated = user2;
				 	bcrypt.compare('password', currentUser.password, function(err, isPasswordMatch) {
 						bcrypt.compare('newpassword', currentUserUpdated.password, function(err, isPasswordMatch2) {
 				 			password1 = isPasswordMatch;
 				 			password2 = isPasswordMatch2;
 				 			closeConnection();
				 			done();
 						});
 					});
			    });
			});
		});
		it('should update user password in MongoDb', function() {
 			should.exist(currentUser, 'User should not be null');
 			should.exist(currentUserUpdated, 'Updated user should not be null');
			assert.ok(password1, 'Current user password');
			assert.ok(password2, 'Current updated user password');
		});
	});
});

describe('Change password', function() {
	var currentUser;
	var currentUserUpdated;
	var currentError;

	describe('with a wrong actual password', function() {
		before(function(done) {
			initializeUser(function (err, user) {
				currentUser = user;
				 passwordService.changePassword(user.email, 'password-bad', 'newpassword', 'newpassword', function(err, user2) {
				 	currentUserUpdated = user2;
				 	currentError = err;
 				 	closeConnection();
				 	done();
 				});
			});
		});
		it('should return INVALID_PASSWORD_PASSWORD_DOES_NOT_MATCH error and not update user password in MongoDb', function() {
 			should.exist(currentUser, 'User should not be null');
 			should.not.exist(currentUserUpdated, 'Updated user should be null');
			assert.equal(errors.INVALID_PASSWORD_PASSWORD_DOES_NOT_MATCH, currentError);
		});
	});
});

describe('Change password', function() {
	var currentUser;
	var currentUserUpdated;
	var currentError;

	describe('with a correct actual password but a mismatch new password - confirmation password', function() {
		before(function(done) {
			initializeUser(function (err, user) {
				currentUser = user;
				 passwordService.changePassword(user.email, 'password', 'newpassword', 'newpassword-fail', function(err, user2) {
				 	currentUserUpdated = user2;
				 	currentError = err;
 				 	closeConnection();
				 	done();
 				});
			});
		});
		it('should return CHANGE_PASSWORD_CONFIRMATION_DOES_NOT_MATCH error and not update user password in MongoDb', function() {
 			should.exist(currentUser, 'User should not be null');
 			should.not.exist(currentUserUpdated, 'Updated user should be null');
			assert.equal(errors.CHANGE_PASSWORD_CONFIRMATION_DOES_NOT_MATCH, currentError);
		});
	});
});


