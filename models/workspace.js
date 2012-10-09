var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var workspaceSchema = new Schema({ 
	name:'String', 
	description:'String', 
	owner:'ObjectId', 
	creationDate:'Date'
});

module.exports = mongoose.model('Workspace', workspaceSchema);
