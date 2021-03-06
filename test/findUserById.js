var should = require("should")
var assert = require("assert")
var mongoose = require("mongoose");

var register = require('../apis/registerService.js');
var account = require('../apis/accountService.js');
var errors = require('../apis/errors.js');

var User = require('../models/user.js');
var UserActivation = require('../models/userActivation.js');

var conn;

function initializeUser(cb) {
	var userId = new mongoose.Types.ObjectId;
	conn = mongoose.connect('mongodb://localhost/likbe-test');
	var email = "john.doe@fake.com", firstname="John", lastname = "Doe";
	var user = new User({ _id:userId, email:email, firstname:firstname, lastname:lastname, active:false });
		user.save(function (err) {
		cb(user);
	});		
}

function closeConnection() {
	mongoose.disconnect();
}

describe('Find user by Id', function() {
	var baseUser;
	var currentUser;
	var error;
		
	describe('using a valid Id', function() {
		before(function(done) {
			initializeUser(function(user) {
				baseUser = user;
				account.findUserById(user._id, function(err, result) {
					currentUser = result;
					error = err;
					closeConnection();
					done();
				});	
			});
		});
		it('should be return a user', function() {
			should.not.exist(error);
			should.exist(currentUser, 'user does not exist');
			assert.notStrictEqual(baseUser._id, currentUser._id);
			assert.equal(baseUser.firstname, currentUser.firstname);
			assert.equal(baseUser.lastname, currentUser.lastname);
			assert.equal(baseUser.email, currentUser.email);
		});
	});
});

describe('Find user by Id', function() {
	var baseUser;
	var currentUser;
	var error;
		
	describe('using an invalid Id', function() {
		before(function(done) {
			initializeUser(function(user) {
				baseUser = user;
				var userIdUnknown = new mongoose.Types.ObjectId;
				account.findUserById(userIdUnknown, function(err, result) {
					currentUser = result;
					error = err;
					closeConnection();
					done();
				});	
			});
		});
		it('should be return a user', function() {
			should.exist(error);
			should.not.exist(currentUser, 'user should not exist');
			assert.equal(errors.COULD_NOT_FIND_USER_BY_ID, error);
		});
	});
});