// var should = require("should")
// var assert = require("assert")
// var mongoose = require("mongoose");
// var async = require("async");

// var register = require('../apis/registerService.js');
// var account = require('../apis/accountService.js');

// var User = require('../models/user.js');
// var UserActivation = require('../models/userActivation.js');

// var conn;

// function initializeUsers(cb) {
// 	conn = mongoose.connect('mongodb://localhost/likbe-test');
// 	var users = [
// 	{email:'john.doe8@fake.com', firstname:'John', lastname:'DOE', roles:[{ name:'admin'}]} ,
// 	{email:'jane.doe1@fake.com', firstname:'Jane', lastname:'DOE'}
// 	];
// 	async.forEach(users, function (user, cb){ 
// 		initializeUser(user, function() {
//         cb();  
//    });

// 	}, function(err) {
// 		cb(users);
// 	});  
// }

// function initializeUser(user, cb) {
// 	User.remove(function() {
// 		UserActivation.remove(function() {
// 			var u = new User({ email:user.email, firstname:user.firstname, lastname:user.lastname, active:false, roles:user.roles });
// 			u.save(function (err) {
// 				cb(user);
// 			});
// 		});
// 	});		
// }

// function openConnection(cb) {
// 	mongoose.connect('mongodb://localhost/likbe-test');
// 	cb();
// }

// function closeConnection() {
// 	mongoose.disconnect();
// }

// function findUserByEmail(users, email, cb) {
// 	var userFound;
// 	users.forEach(function(user) {
// 		if (user.email == email) { userFound = user; }
// 	});
// 	cb(userFound);
// }

// describe('Is user admin', function() {
// 	var u = [];
// 	before(function(done) {
// 		initializeUsers(function(users) {
// 			u = users;
// 			closeConnection();
// 			done();
// 		});
// 	});	
// 	describe('using an admin user account', function() {
// 		it('should return the user', function() {
// 			findUserByEmail(u, 'john.doe8@fake.com', function(userFound) {
// 				account.isUserAdmin(userFound.email, function(err, user) {
// 					should.exist(user);
// 				});
// 			});
// 		});
// 		describe('using an non-admin user account', function() {
// 			it('should return null', function() {
// 				findUserByEmail(u, 'jane.doe1@fake.com', function(userFound) {
// 					account.isUserAdmin(userFound.email, function(err, user) {
// 						should.exist(user);
// 					});
// 				});
// 			});
// 		});
// 	});
// });