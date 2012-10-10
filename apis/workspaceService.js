var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var logger = require("./loggerService.js").logger;
var User = require('../models/user.js');
var errors = require('./errors.js');

var Workspace = require('../models/workspace.js');

exports.findWorkspacesByOwner = function(userId, callback) {
  Workspace.find({owner:userId}, function(err, workspaces) {
    if (err) { 
      logger.info('findWorkspacesByOwner - Unable to search workspaces for user: ' + userId); 
      callback(errors.COULD_NOT_SEARCH_WORKSPACE_BY_OWNER, null); }
    else { 
      if (workspaces.length == 0) {
        logger.info('findWorkspacesByOwner - Found no workspace for user:' + userId); 
      }
      else {
        logger.info('findWorkspacesByOwner - Found following workspaces: ' + workspaces + ' for user:' + userId); 
      }
      callback(null, workspaces); 
    }
  });
}

exports.findWorkspaceByIdAndUser = function(workspaceId, userId, callback) {
  Workspace.findOne({owner:userId, _id:workspaceId}, function(err, workspace) {
    callback(err, workspace);
  });
}

exports.create = function(userId, name, description, callback) {
  this.exists(userId, name, function(err, exists) {
    if (exists) {
      logger.info('createWorkspace - Workspace:' + name + ' already exists for owner:' + userId);
      callback(errors.WORKSPACE_ALREADY_EXISTS, null);
    }
    else
    {
      logger.info('createWorkspace - Workspace:' +  name + ' does not already exists for owner:' + userId);
      var workspaceId = new mongoose.Types.ObjectId;
      var creationDate = new Date();
      var workspace = new Workspace({ _id:workspaceId, name:name, description:description, owner:userId,creationDate:creationDate });
      workspace.save(function(err2) {
        callback(err || err2, workspace);
      });
    }
  });
}

exports.exists = function(userId, name, callback) {
 Workspace.findOne({owner: userId, name:name}, function(err, result) {
    if (err || !result) { callback(err, false); }
    else { callback(err, true); }
  });
}

