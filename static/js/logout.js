$(document).ready(function() {
	$('#logout-action').click(function() {
		$.post('/user/logout', function() {
  			$('#result').html('<h2>Logged out !</h2>');
		});
	});
});
