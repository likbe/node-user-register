var should = require("should")
var mongoose = require("mongoose");

var register = require('../apis/registerService.js');

var User = require('../models/user.js');
var UserActivation = require('../models/userActivation.js');

function initializeUser(cb) {
	mongoose.connect('mongodb://localhost/users', function() {
		User.remove(function() {
			UserActivation.remove(function() {
				cb(null);	
			});	
		});
	});
}

function closeConnection() {
	mongoose.disconnect();
}

describe('Register a user', function() {
	var currentUser;

	describe('with complete informations', function() {
		before(function(done) {
			initializeUser(function () {
				register.registerUser('johnny.doe@fake.com', 'John', 'Doe', function(err, user) {
					currentUser = user;
					closeConnection();
					done();
				});
			});
		});
		it('should save a user into MongoDb', function() {
 			should.exist(currentUser);
 			currentUser.should.have.property('firstname', 'John');
 			currentUser.should.have.property('lastname'), 'Doe';
 			currentUser.should.have.property('email', 'johnny.doe@fake.com');
 			currentUser.should.have.property('active', false);
		});
	});
});