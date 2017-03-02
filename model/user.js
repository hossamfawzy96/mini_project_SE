var mongoose = require('mongoose');
mongoose.Promise = Promise;
var projectSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:String, type:String
})

var User = mongoose.model('users', projectSchema);
module.exports = User;
