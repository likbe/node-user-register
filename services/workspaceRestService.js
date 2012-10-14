var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var logger = require("../apis/loggerService.js").logger;
var User = require('../models/user.js');
var errors = require('../apis/errors.js');
var workspaceApis = require('../apis/workspaceService.js');

var Workspace = require('../models/workspace.js');


exports.getWorkspacesByOwner = function(req, res) {
  workspaceApis.findWorkspacesByOwner(req.user._id, function(err, workspaces) {
    if (!err) {
    res.send(workspaces);
    }
    else {
      logger.error('findWorkspacesByOwner - Failed to retrieve workspaces for owner : ' + req.user._id);
    }
  });
}