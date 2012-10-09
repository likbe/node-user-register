exports.index = function(req, res) {
	var currentLayout = getLayout(req); 
	console.log(currentLayout);
	res.render('home', {layout:currentLayout});
}

function getLayout(req) {
 if (req.isAuthenticated) { 
 	return 'layoutAuthenticated'; }
 else { 
 	return 'layout'; }
}
