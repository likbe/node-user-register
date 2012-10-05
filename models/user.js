var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var roleSchema = new Schema({ 
	name:'String'
});

var exports = module.exports = mongoose.model('Role', roleSchema);

var userSchema = new Schema({ 
	email:'String', 
	password:'String', 
	firstname:'String', 
	lastname:'String', 
	active:'Boolean',
	roles:[roleSchema]
});

module.exports = mongoose.model('User', userSchema);
