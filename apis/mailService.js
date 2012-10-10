var config = require('../config.js');
var mandrill = require('node-mandrill')(config.mandrill.apiKey);
var logger = require("./loggerService.js").logger;

exports.sendActivationMail = function(email, firstname, lastname, activationKey, callback) {
  var activationLink = "http://"+config.mail.host+"/user/activate/" + activationKey;
  mandrill('/messages/send', {
    message: {
        to: [{email: email, name: firstname + ' ' + lastname}],
        from_email: 'register@likbe.com',
        subject: "Likbe - Thank you for registering, action required",
        html: "Thank you for registering, <br/>" +
        "Please click on the following link to confirm your email and activate your account :<br/>" +
        "<a href='"+activationLink+"'>ACTIVATE YOUR ACCOUNT</a><br/>Regards,"
    }
  }, function(error, response)
  {
    logger.error('unable to send activation mail to user : ' + email)
    callback(error, response);
  });
}