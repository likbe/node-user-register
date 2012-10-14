var accountService = require('../apis/accountService.js');
var workspaceService = require('../apis/workspaceService.js');

exports.dashboard = function(req, res) {
	workspaceService.findWorkspacesByOwner(req.user._id, function(err, workspaces) {
		if (workspaces && workspaces.length > 0) {
			res.render('dashboard', {user : req.user, layout : 'layoutAuthenticated', workspaces: workspaces});
		}
		else {
			res.redirect('/workspace/create');
		}
	});
}