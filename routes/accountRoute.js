var accountService = require('../apis/accountService.js');
var passwordService = require('../apis/passwordService.js');
var workspaceService = require('../apis/workspaceService.js');
var errors = require('../apis/errors.js');

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
			res.clearCookie('connect.sid', {path:'/'});
			res.redirect('/');	
		});
	}
}

exports.myAccount = function(req, res) {
	if (req.user) {
		res.render('myAccount', { user : req.user, currentpage:'MyAccount', success: req.flash('changepassword-ok'), error: req.flash('changepassword-error')});
	}
}

exports.changePassword = function(req, res) {
  passwordService.changePassword(req.user.email, req.body.actualPassword, req.body.newPassword, req.body.confirmPassword, function(err) 
  {
    if (err == errors.CHANGE_PASSWORD_CONFIRMATION_DOES_NOT_MATCH) {
      req.flash('changepassword-error', 'Oops, your new password does not match its confirmation password');
      res.redirect('/user/account');
    }
    else if (err == errors.INVALID_PASSWORD_PASSWORD_DOES_NOT_MATCH) {
      req.flash('changepassword-error', 'Oops, your actual password does not match your actual credentials');
      res.redirect('/user/account');
    }
    else if (err) { 
      req.flash('changepassword-error', 'Oops, there is a technical error, you cannot change your password at the moment.');
      res.redirect('/user/account');
    }
    else { 
      req.flash('changepassword-ok', 'Thanks, you can now use your new password to sign-in.');
      res.redirect('/user/account'); 
    } 
  });
}