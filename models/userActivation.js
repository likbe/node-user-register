var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var userActivationSchema = new Schema({ 
	activationKey:'String',
	user_id:'ObjectId'
});

module.exports = mongoose.model('UserActivation', userActivationSchema);