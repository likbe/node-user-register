var should = require("should")
var mongoose = require("mongoose");

var register = require('../apis/registerService.js');

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
    					if (err) cb(err);
    					else cb(null);
					});
				});
			});
		});		
}

function closeConnection() {
	mongoose.disconnect();
}

describe('Activate a user', function() {
	var currentUser;
		
	describe('with a valid activation key', function() {
		before(function(done) {
			initializeUser(function () {
				register.activateUser('fb6b4c32-7a2c-407e-b69e-9b6df92c71d5', 'password', function(err, res) {
					currentUser = res;
					closeConnection();
					done();
				});
			});
		});
		it('returned a user', function() {
				should.exist(currentUser);
				// bCrypt hashes length are equal to 60
				currentUser.should.have.property('password').with.length(60);
				currentUser.should.not.have.property('password', 'password');
				currentUser.should.have.property('active', true);
		});
	});
});

describe('Desactivate a user', function() {
	var currentUser;

	describe('who is activated', function() {
		before(function(done) {
			initializeUser(function () {
				register.activateUser('fb6b4c32-7a2c-407e-b69e-9b6df92c71d5', 'password', function(err, res) {
					register.desactivateUser('fb6b4c32-7a2c-407e-b69e-9b6df92c71d5', function(err, res) {
						currentUser = res;
						closeConnection();
						done();
					});
				});
			});
		});
		it('returned a user', function() {
				should.exist(currentUser);
				// bCrypt hashes length are equal to 60
				currentUser.should.have.property('password').with.length(60);
				currentUser.should.not.have.property('password', 'password');
				currentUser.should.have.property('active', false);
		});
	});
});