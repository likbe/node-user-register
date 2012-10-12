var should = require("should")
var assert = require("assert")
var mongoose = require("mongoose");

var register = require('../apis/registerService.js');
var workspaceService = require('../apis/workspaceService.js');

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

describe('Find a workspace with correct name and owner', function() {
	var workspaceFound;

	describe('using an existing workspace', function() {
		before(function(done) {
			initializeWorkspace(function(err, user, workspace) {
				workspaceService.findWorkspaceByIdAndUser(workspace._id, user._id, function(err, workspace) {
					workspaceFound = workspace;
					closeConnection();
					done();
				});
			});
		});
		it('should be true', function() {
			assert.exists(workspaceFound);
		});
	});
});