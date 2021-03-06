var should = require("should")
var assert = require("assert")
var mongoose = require("mongoose");

var register = require('../apis/registerService.js');
var account = require('../apis/accountService.js');

var User = require('../models/user.js');
var UserActivation = require('../models/userActivation.js');

var conn;

function initializeUser(cb) {
	var userId = new mongoose.Types.ObjectId;
	conn = mongoose.connect('mongodb://localhost/likbe-test');
	var email = "john.doe1@fake.com", firstname="John", lastname = "Doe";
	var user = new User({ _id:userId, email:email, firstname:firstname, lastname:lastname, active:false });
	User.remove(function() {
	user.save(function (err) {
		cb(user);
	});		
});
}

function openConnection(cb) {
	mongoose.connect('mongodb://localhost/likbe-test');
	cb();
}

function closeConnection() {
	mongoose.disconnect();
}

describe('Does user exists', function() {
	var userExists = false;
		
	describe('using an existing email address', function() {
		before(function(done) {
			initializeUser(function(user) {
				account.exists(user.email, function(err, exists) {
					userExists = exists;
					closeConnection();
					done();
				});
			});
		});
		it('should return true', function() {
			assert.equal(true, userExists, 'User should exists');
		});
	});

	describe('using an non-existing email address', function() {
		before(function(done) {
			openConnection(function() {
				account.exists('invalid@address.ext', function(err, exists) {
					userExists = exists;
					closeConnection();
					done();		
				});
			});
		});
		it('should return false', function() {
			assert.equal(false, userExists, 'User should not exists');
		});
	});
});