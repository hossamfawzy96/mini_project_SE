var mongoose = require('mongoose');
mongoose.Promise = Promise;
var projectSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    path:String,
    username:String
})

var Project = mongoose.model('project_screen', projectSchema);

module.exports = Project;
