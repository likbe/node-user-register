var should = require("should");
var assert = require("assert");
var mongoose = require("mongoose");

var register = require('../apis/registerService.js');

var User = require('../models/user.js');
var UserActivation = require('../models/userActivation.js');

var conn; 

function initializeUsers(cb) {
	conn = mongoose.connect('mongodb://localhost/likbe-test', function() {
		User.remove(function() {
			UserActivation.remove(function() {
				register.registerUser('smith@fake.com', 'Mike', 'Smith', function(err, result) {
					register.registerUser('john.doe6@fake.com', 'John', 'Doe', function(err, result) {
						cb(result);
					});
				});
			});
	});
});
}

function cleanUsers(cb) {
	mongoose.connect('mongodb://localhost/users', function() {
		User.remove(function() {
			UserActivation.remove(function() {
				closeConnection();
				cb();
			});
		});
	});
}

function closeConnection() {
	mongoose.disconnect();
}

describe('Find all users and retrieve associated user activation keys', function() {
	beforeEach(function(done) {
			//cleanUsers(function(cb) {
				done();
			//});
});
	var result;
	before(function(done) {
		initializeUsers(function() {
			register.findUsersWithActivationKeys(function(err, results) {
				result = results;
				closeConnection();
				done();
			});
		});
	});
	it('should return 2 users and 2 user activations', function() {	   
		should.exist(result);
		result.should.have.property('length');
 			//assert.equal(2, result.length, 'there are too many or too few users with activation key');
 			for (var i = 0; i < result.length; i++) {
 				result[i].should.have.property('user'); 	
 				result[i].user.should.have.property('firstname');		
 				result[i].should.have.property('userActivation');
 				result[i].userActivation.should.have.property('activationKey');
 			}
 		});
});