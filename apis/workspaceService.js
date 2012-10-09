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