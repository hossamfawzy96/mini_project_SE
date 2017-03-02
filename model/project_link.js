var mongoose = require('mongoose');
mongoose.Promise = Promise;
var projectSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    URL:String,
    username:String
})

var Project = mongoose.model('project_link', projectSchema);

module.exports = Project;
