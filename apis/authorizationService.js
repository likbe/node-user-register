var accountService = require("./accountService.js");
var async = require("async");

extractFeatureKey = function(req) {
	return req.url;
}

isAdmin = function(item, callback) {
    if (item.name == 'admin') { callback(true); }
    else { callback(false); }
}

isWorkspaceCreator = function(item, callback) {
    console.log(item);
    if (item.name == 'workspaceCreator') { callback(true); }
    else { callback(false); }
}

exports.ensureSecurity = function(req, res, next) {
	var featuresUrl = extractFeatureKey(req);
    var isAuthorized = false;
    if (req.isAuthenticated()) {
    	if (featuresUrl == "/users") {
            async.detect(req.user.roles, isAdmin, function(result) {
                if (result != null) {
                    isAuthorized = true;
                }
            });
    	}

        else if (featuresUrl == "/workspace/create") {
            async.detect(req.user.roles, isWorkspaceCreator, function(result) {
                if (result != null) {
                    isAuthorized = true;
                }
                else console.log('not authorized to create workspace');
            });
        }

        else {
            isAuthorized = true;
        }
 	}
    if (isAuthorized) { return next(); }
    else { return res.redirect('/user/login'); }
}