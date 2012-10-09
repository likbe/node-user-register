var Workspace = require('../models/workspace.js');
var workspaceService = require('../apis/workspaceService.js');
var errors = require('../apis/errors.js');

exports.create = function(req, res) {
  workspaceService.create(req.user._id, req.body.name, req.body.description, function(err) 
  {
    if (err == errors.WORKSPACE_ALREADY_EXISTS) {
      req.flash('workspace-error', 'Oops, workspace already exists');
      res.redirect('/user/dashboard');
    }
    else if (err) { 
      req.flash('workspace-error', 'Oops, we cannot create workspace at this time.');
      res.redirect('/user/dashboard');
    }
    else { 
      req.flash('workspace-ok', 'Great, your workspace was created.');
      res.redirect('/user/dashboard'); 
    } 
  });
}