var mongoose = require('mongoose');
mongoose.Promise = Promise;
var projectSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    path:String
})

var Image = mongoose.model('profile_pictures', projectSchema);

module.exports = Image;
