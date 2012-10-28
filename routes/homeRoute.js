exports.index = function(req, res) {
	var currentLayout = getLayout(req); 
	 if (currentLayout == 'layout') { 
		res.render('home', {layout:currentLayout, currentpage:'Home'});
	}
	else {
		res.render('homeAuthenticated', {layout:currentLayout, user:req.user, currentpage:'Home'});
	}
}

function getLayout(req) {
 if (req.isAuthenticated && req.user) { 
 	return 'layoutAuthenticated'; }
 else { 
 	return 'layout'; }
}
