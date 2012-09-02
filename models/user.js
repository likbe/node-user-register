var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var userSchema = new Schema({ 
	email:'String', 
	password:'String', 
	firstname:'String', 
	lastname:'String', 
	active:'Boolean'
});

module.exports = mongoose.model('User', userSchema);