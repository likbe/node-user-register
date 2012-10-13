var should = require("should")
var assert = require("assert")
var mongoose = require("mongoose");

var register = require('../apis/registerService.js');
var workspaceService = require('../apis/workspaceService.js');
var errors = require('../apis/errors.js');

var User = require('../models/user.js');
var Workspace = require('../models/workspace.js');

var conn;

function initializeWorkspace(cb) {
	var workspaceId = new mongoose.Types.ObjectId;
	var ownerId = new mongoose.Types.ObjectId;
	conn = mongoose.connect('mongodb://localhost/likbe-test');
	var user = new User ({ _id : ownerId, firstname:'John', lastname:'Doe', email:'john.doe@fake.com'});
	User.remove(function(err) {
		user.save(function (err2) {
			var name = "Fake Workspace", description="This is a fake workspace created by automated test";
			var workspace = new Workspace({ _id:workspaceId, name:name, description:description, owner: ownerId });
			workspace.save(function(err3) {
				cb(err || err2 || err3, user, workspace);
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

describe('Find a workspace', function() {
	var workspacesFound;
	var currentError;

	describe('using an existing owner', function() {
		before(function(done) {
			initializeWorkspace(function(err, user, workspace) {
				workspaceService.findWorkspacesByOwner(user._id, function(err, workspaces) {
					currentError = err;
					workspacesFound = workspaces;
					closeConnection();
					done();
				});
			});
		});
		it('should return a list of workspaces', function() {
			assert.exists(workspacesFound);
			assert.not.exists(currentError);
			assert.equal(1, workspacesFound.length);
			workspacesFound[0].should.have.property('name', 'Fake Workspace');
 			workspacesFound[0].should.have.property('description', 'This is a fake workspace created by automated test');
		});
	});

	describe('using an invalid owner', function() {
		before(function(done) {
			initializeWorkspace(function(err, user, workspace) {
				workspaceService.findWorkspacesByOwner('0', function(err, workspaces) {
					currentError = err;
					workspacesFound = workspaces;
					closeConnection();
					done();
				});
			});
		});
		it('should return COULD_NOT_SEARCH_WORKSPACE_BY_OWNER error', function() {
			assert.exist(currentError);
			assert.equal(currentError, errors.COULD_NOT_SEARCH_WORKSPACE_BY_OWNER)
			assert.not.exists(workspacesFound);
		});
	});
});

