var should = require("should")
var mongoose = require("mongoose");

var registerService = require('../apis/registerService.js');
var User = require('../models/user.js');
var UserActivation = require('../models/userActivation.js');

var conn;

function initializeUser(cb) {
	User.remove(function() {	
		UserActivation.remove(function() {
			registerService.registerUser('john.doe9@fake.com', 'John', 'Doe', function(err, user) {
				cb(err, user);
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
			conn = mongoose.connect('mongodb://localhost/likbe-test');
			initializeUser(function (err, user) {
					currentUser = user;
					closeConnection();
					done();
			});
		});
		it('should save a user into MongoDb', function() {
 			should.exist(currentUser, 'User should not be null');
 			currentUser.should.have.property('firstname', 'John');
 			currentUser.should.have.property('lastname', 'DOE');
 			currentUser.should.have.property('email', 'john.doe9@fake.com');
 			currentUser.should.have.property('active', false);
 		});
	});
});