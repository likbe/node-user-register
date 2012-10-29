var Workspace = require('../models/workspace.js');
var workspaceService = require('../apis/workspaceService.js');
var errors = require('../apis/errors.js');

exports.create = function(req, res) {
  workspaceService.create(req.user._id, req.body.name, req.body.description, function(err) 
  {
    if (err == errors.WORKSPACE_ALREADY_EXISTS) {
      req.flash('workspace-error', 'Oops, workspace already exists');
      res.redirect('/workspace/create');
    }
    else if (err) { 
      req.flash('workspace-error', 'Oops, we cannot create workspace at this time.');
      res.redirect('/workspace/create');
    }
    else { 
      req.flash('workspace-ok', 'Great, your workspace was created.');
      res.redirect('/workspace/create'); 
    } 
  });
}

exports.createNew = function(req, res) {
    workspaceService.findWorkspacesByOwner(req.user._id, function(err, workspaces) {
    res.render('workspaceCreate', {user : req.user, layout : 'layoutAuthenticated', currentpage:'Dashboard', workspaces: workspaces});
  });
}

exports.view = function(req, res) {
  workspaceService.findWorkspaceByIdAndUser(req.params.workspaceId, req.user._id, function(err, workspace) {
    res.render('workspace', {user : req.user, currentpage:'Dashboard', layout: 'layoutAuthenticated', workspace: workspace});
  });
}