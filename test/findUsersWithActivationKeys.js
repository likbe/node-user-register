var should = require("should");
var assert = require("assert");
var mongoose = require("mongoose");

var register = require('../apis/registerService.js');

var User = require('../models/user.js');
var UserActivation = require('../models/userActivation.js');

function initializeUsers(cb) {
	mongoose.connect('mongodb://localhost/users', function() {
		User.remove(function() {
			UserActivation.remove(function(err) {
				if (err) cb(err);
				register.registerUser('smith@fake.com', 'Mike', 'Smith', function(err, result) {
					register.registerUser('john@fake.com', 'John', 'Doe', function(err, result) {
						cb(result);
					});
				});
			});	
		});
	});
}

function closeConnection() {
	mongoose.disconnect();
}

describe('Find all users and retrieve associated user activation keys', function() {
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
 			assert.equal(2, result.length);
 			for (var i = 0; i < result.length; i++) {
 				result[i].should.have.property('user'); 	
 				result[i].user.should.have.property('firstname');		
 				result[i].should.have.property('userActivation');
 				result[i].userActivation.should.have.property('activationKey');
 			}
		});
});