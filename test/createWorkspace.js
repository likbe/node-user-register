var should = require("should");
var assert = require("assert");
var mongoose = require("mongoose");
var errors = require('../apis/errors.js');

var register = require('../apis/registerService.js');
var workspaceService = require('../apis/workspaceService.js');

var User = require('../models/user.js');
var Workspace = require('../models/workspace.js');

var conn;

function initializeWorkspace(cb) {
	var userId = new mongoose.Types.ObjectId;
	conn = mongoose.connect('mongodb://localhost/likbe-test');
	var user = new User ({ _id : userId, firstname:'John', lastname:'Doe', email:'john.doe@fake.com'});
	Workspace.remove(function(err) {
		User.remove(function(err2) {
			user.save(function (err3) {
				cb(err || err2 || err3, user);
			});
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

describe('Create a workspace', function() {

	describe('not already existing with complete informations', function() {
		var currentWorkspace;
		var currentError;

		before(function(done) {
			initializeWorkspace(function(err, user) {
				var workspaceId = new mongoose.Types.ObjectId;
				var name = "Fake Workspace", description="This is a fake workspace created by automated test";
				var workspace = new Workspace({ _id:workspaceId, name:name, description:description, owner: user._id });
				workspaceService.create(workspace.owner, workspace.name, workspace.description, function(err, result) {
					currentError = err;
					currentWorkspace = result;
					closeConnection();
					done();
				});
			});
		});
		it('should be created', function() {
			should.not.exist(currentError, 'Error should not exists');
		    should.exist(currentWorkspace, 'Workspace should exists');
 			currentWorkspace.should.have.property('name', 'Fake Workspace');
 			currentWorkspace.should.have.property('description', 'This is a fake workspace created by automated test');
		});
	});

		describe('already existing', function() {
		var currentWorkspace;
		var currentError;

		before(function(done) {
			initializeWorkspace(function(err, user) {
				var workspaceId = new mongoose.Types.ObjectId;
				var name = "Fake Workspace", description="This is a fake workspace created by automated test";
				var workspace = new Workspace({ _id:workspaceId, name:name, description:description, owner: user._id });
				workspaceService.create(workspace.owner, workspace.name, workspace.description, function(err, result) {
					workspaceService.create(workspace.owner, workspace.name, workspace.description, function(err2, result2) {
						currentError = err2;
						currentWorkspace = result2;
						closeConnection();
						done();
					});
				});
			});
		});
		it('should be failed with WORKSPACE_ALREADY_EXISTS error', function() {
			should.exist(currentError, 'Error should exists');
			assert.equal(currentError, errors.WORKSPACE_ALREADY_EXISTS)
		    should.not.exist(currentWorkspace, 'Current workspace should not exists');
		});
	});
});