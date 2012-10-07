var should = require("should")
var mongoose = require("mongoose");

var register = require('../apis/registerService.js');

var User = require('../models/user.js');
var UserActivation = require('../models/userActivation.js');

var conn;

function initializeUser(cb) {
	conn = mongoose.connect('mongodb://localhost/likbe-test');
	var userId = new mongoose.Types.ObjectId;
	var email = "john.doe@fake.com", firstname="John", lastname = "Doe";
	var user = new User({ _id:userId, email:email, firstname:firstname, lastname:lastname, active:false });
		user.save(function (err) {
		var userActivation = new UserActivation({ activationKey: 'fb6b4c32-7a2c-407e-b69e-9b6df92c71d5', user_id: userId });
		userActivation.save(function(err) {
			if (err) cb(err);
			else cb(null);
		});
	});		
}

function closeConnection() {
	conn.connection.db.dropDatabase();
	mongoose.disconnect();
}

describe('Get user by activation key', function() {
	var currentUser;
		
	describe('with a valid activation key', function() {
		before(function(done) {
			initializeUser(function () {
				register.findUserByActivationKey('fb6b4c32-7a2c-407e-b69e-9b6df92c71d5', function(err, res) {
					currentUser = res;
					closeConnection();
					done();
				});
			});
		});
		it('returned a user', function() {
				should.exist(currentUser);
				currentUser.should.have.property('firstname', 'John');
		});
	});

	describe('with an invalid activation key', function() {
		before(function(done) {
			initializeUser(function () {
				register.findUserByActivationKey('0000-00000-00000-00000', function(err, res) {
					currentUser = res;
					closeConnection();
					done();
				});
			});
		});
		it('returned nothing', function() {
				should.not.exist(currentUser);
		});
	});


	describe('without activation key', function() {
		before(function(done) {
			initializeUser(function () {
				register.findUserByActivationKey('', function(err, res) {
					currentUser = res;
					closeConnection();
					done();
				});
			});
		});
		it('returned nothing', function() {
				should.not.exist(currentUser);
		});
	});
});