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
	var user2 = new User ({firstname:'Jane', lastname:'Doe', email:'jane.doe@fake.com'});
	User.remove(function(err) {
		user.save(function (err2) {
			var name = "Fake Workspace", description="This is a fake workspace created by automated test";
			var workspace = new Workspace({ _id:workspaceId, name:name, description:description, owner: ownerId });
			workspace.save(function(err3) {
				user2.save(function(err4) {
				  cb(err || err2 || err3 || err4, [user, user2], workspace);
				}
			  );
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
	var currentUsers;
	var currentError;

	describe('using an existing owner with workspace', function() {
		before(function(done) {
			initializeWorkspace(function(err, users, workspace) {
				workspaceService.findWorkspacesByOwner(users[0]._id, function(err, workspaces) {
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

	describe('using an existing owner with no workspace', function() {
		before(function(done) {
			initializeWorkspace(function(err, users, workspace) {
				workspaceService.findWorkspacesByOwner(users[1]._id, function(err, workspaces) {
					currentError = err;
					currentUsers = users;
					workspacesFound = workspaces;
					closeConnection();
					done();
				});
			});
		});
		it('should return an empty list of workspaces', function() {
			assert.exists(currentUsers);
			assert.equal(2, currentUsers.length);
			assert.not.exists(currentError);
			assert.equal(0, workspacesFound.length);
		});
	});

	describe('using an invalid owner', function() {
		before(function(done) {
			initializeWorkspace(function(err, users, workspace) {
				workspaceService.findWorkspacesByOwner('999999', function(err, workspaces) {
					currentError = err;
					workspacesFound = workspaces;
					currentUsers = users;
					closeConnection();
					done();
				});
			});
		});
		it('should return COULD_NOT_SEARCH_WORKSPACE_BY_OWNER error', function() {
			assert.exist(currentError);
			assert.exists(currentUsers);
			assert.equal(2, currentUsers.length);
			assert.equal(currentError, errors.COULD_NOT_SEARCH_WORKSPACE_BY_OWNER)
			assert.not.exists(workspacesFound);
		});
	});
});

