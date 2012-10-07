var accountService = require("./accountService.js");

extractFeatureKey = function(req) {
	console.log(req.url);
	return req.url;
}

exports.ensureSecurity = function(req, res, next) {
	var featureKey = extractFeatureKey(req);
	console.log('feature key:'+featureKey);
    if (req.isAuthenticated()) {
    	// TODO check for 'admin' role only
    	if (featureKey == "/users" && req.user.roles.length == 1) {
    		return next();
    	}
 	}
    return res.redirect('/user/login');
}