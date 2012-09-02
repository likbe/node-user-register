var should = require("should")
var mongoose = require("mongoose");

var register = require('../apis/registerService.js');
var account = require('../apis/accountService.js');

var User = require('../models/user.js');
var UserActivation = require('../models/userActivation.js');

function initializeUser(cb) {
	var userId = new mongoose.Types.ObjectId;
	mongoose.connect('mongodb://localhost/users');
		User.remove(function() {
			UserActivation.remove(function() {
				var email = "john.doe@fake.com", firstname="John", lastname = "Doe";
				var user = new User({ _id:userId, email:email, firstname:firstname, lastname:lastname, active:false });
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
		it('should be return error code 1', function() {
			should.exist(error);
			error.should.equal(1);
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
		it('should be return error code 2', function() {
			should.exist(error);
			error.should.equal(2);
			should.not.exist(currentUser, 'user does not exist');
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
		it('should be return error code 3', function() {
			should.exist(error);
			error.should.equal(3);
			should.not.exist(currentUser, 'user does not exist');
		});
	});
});