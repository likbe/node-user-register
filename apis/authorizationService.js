var accountService = require("./accountService.js");
var async = require("async");

extractFeatureKey = function(req) {
	console.log(req.url);
	return req.url;
}

isAdmin = function(item, callback) {
    console.log(item);
    if (item.name == 'admin') { callback(true); }
    else { callback(false); }
}

exports.ensureSecurity = function(req, res, next) {
	var featureKey = extractFeatureKey(req);
    var isAuthorized = false;
    if (req.isAuthenticated()) {
    	if (featureKey == "/users") {
            async.detect(req.user.roles, isAdmin, function(result) {
                if (result != null) {
                    isAuthorized = true;
                }
            });
    	}
        else {
            isAuthorized = true;
        }
 	}
    if (isAuthorized) { return next(); }
    else { return res.redirect('/user/login'); }
}