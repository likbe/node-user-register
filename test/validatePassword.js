var should = require("should")
var mongoose = require("mongoose");

var register = require('../apis/registerService.js');
var account = require('../apis/accountService.js');

var User = require('../models/user.js');
var UserActivation = require('../models/userActivation.js');

var errors = require('../apis/errors.js');

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
			register.activateUser('fb6b4c32-7a2c-407e-b69e-9b6df92c71d5', 'password', function(err, res) {										
				if (err) cb(err);
				else cb(null);
			});
		});
		});
		});
	});		
}

function closeConnection() {
	mongoose.disconnect();
}

describe('Validate password', function() {
	var currentUser;
	var error;
		
	describe('using a valid password', function() {
		before(function(done) {
			initializeUser(function() {
				account.validatePassword('john.doe@fake.com', 'password', function(err, user) {
					currentUser = user;
					error = err;
					closeConnection();
					done();
				});	
			});
		});
		it('should be return an authenticated user', function() {
			should.not.exist(error);
			should.exist(currentUser, 'user does not exist');
			currentUser.should.not.have.property('password', 'password');
			currentUser.should.have.property('firstname', 'John');
			currentUser.should.have.property('lastname', 'Doe');
		});
	});
});


describe('Validate password', function() {
	var currentUser;
	var error;
		
	describe('using an unknown user', function() {
		before(function(done) {
			initializeUser(function() {
				account.validatePassword('unknown@fake.com', 'password', function(err, user) {
					currentUser = user;
					error = err;
					closeConnection();
					done();
				});	
			});
		});
		it('should be return error code INVALID_PASSWORD_USER_DOES_NOT_EXIST', function() {
			should.exist(error, 'Error should exists');
			error.should.equal(errors.INVALID_PASSWORD_USER_DOES_NOT_EXIST);
			should.not.exist(currentUser, 'user does not exist');
		});
	});
});

describe('Validate password', function() {
	var currentUser;
	var error;
		
	describe('on a unactivated user with a valid password', function() {
		before(function(done) {
			initializeUser(function() {
				register.desactivateUser('fb6b4c32-7a2c-407e-b69e-9b6df92c71d5', function(err) {
					account.validatePassword('john.doe@fake.com', 'wrongPassword', function(err, user) {
						currentUser = user;
						error = err;
						closeConnection();
						done();
					});	
				});
			});
		});
		it('should be return error INVALID_PASSWORD_USER_IS_NOT_ACTIVE', function() {
			should.exist(error, 'Error should exists');
			error.should.equal(errors.INVALID_PASSWORD_USER_IS_NOT_ACTIVE);
			should.not.exist(currentUser, 'user does not exists');
		});
	});
});

describe('Validate password', function() {
	var currentUser;
	var error;
		
	describe('using a wrong password', function() {
		before(function(done) {
			initializeUser(function() {
				account.validatePassword('john.doe@fake.com', 'wrongPassword', function(err, user) {
					currentUser = user;
					error = err;
					closeConnection();
					done();
				});	
			});
		});
		it('should be return error code INVALID_PASSWORD_PASSWORD_DOES_NOT_MATCH', function() {
			should.exist(error, 'Error should exists');
			error.should.equal(errors.INVALID_PASSWORD_PASSWORD_DOES_NOT_MATCH);
			should.not.exist(currentUser, 'user does not exist');
		});
	});
});