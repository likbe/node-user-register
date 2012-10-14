var accountService = require('../apis/accountService.js');
var workspaceService = require('../apis/workspaceService.js');

exports.login = function(res, user) {
	accountService.login(user, function(err, result) {
		if (err) { res.render('error', { error : { message: 'Unable to retrieve user with id : ' + user }}); }
		else { res.redirect('/user/dashboard'); }
	});
}

exports.logout = function(req, res) {
	if (req.user) {
		accountService.logout(req.user, function(err, done) {
			req.logOut();
			res.redirect('/');	
		});
	}
}
