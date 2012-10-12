var should = require("should")
var mongoose = require("mongoose");

var register = require('../apis/registerService.js');
var account = require('../apis/accountService.js');

var User = require('../models/user.js');
var UserActivation = require('../models/userActivation.js');

var conn;

function initializeUser(cb) {
	var userId = new mongoose.Types.ObjectId;
	conn = mongoose.connect('mongodb://localhost/likbe-test');
	var email = "john.doe4@fake.com", firstname="John", lastname = "Doe";
	var user = new User({ _id:userId, email:email, firstname:firstname, lastname:lastname, active:false });
	user.save(function (err) {
		cb(user);
	});		
}

function closeConnection() {
	mongoose.disconnect();
}

describe('Find user by email', function() {
	var currentUser;
	var error;
		
	describe('using a valid email', function() {
		before(function(done) {
			initializeUser(function() {
				account.findUserByEmail('john.doe4@fake.com', function(err, user) {
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
			currentUser.should.not.have.property('password');
			currentUser.should.have.property('firstname', 'John');
			currentUser.should.have.property('lastname', 'Doe');
		});
	});
});