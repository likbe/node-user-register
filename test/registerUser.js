var should = require("should")
var mongoose = require("mongoose");

var register = require('../apis/registerService.js');

var User = require('../models/user.js');
var UserActivation = require('../models/userActivation.js');

var conn;

function initializeUser(cb) {
	register.registerUser('john.doe@fake.com', 'John', 'Doe', function(err, user) {
		cb(err, user);
	});
}

function closeConnection() {
	conn.connection.db.dropDatabase();
	mongoose.disconnect();
}

describe('Register a user', function() {
	var currentUser;

	describe('with complete informations', function() {
		before(function(done) {
			conn = mongoose.connect('mongodb://localhost/likbe-test');
			initializeUser(function (err, user) {m
					currentUser = user;
					closeConnection();
					done();
			});
		});
		it('should save a user into MongoDb', function() {
 			should.exist(currentUser);
 			currentUser.should.have.property('firstname', 'John');
 			currentUser.should.have.property('lastname'), 'Doe';
 			currentUser.should.have.property('email', 'john.doe@fake.com');
 			currentUser.should.have.property('active', false);
 		});
	});
});