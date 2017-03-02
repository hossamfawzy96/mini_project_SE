var mongoose = require("mongoose");
mongoose.Promise = Promise;

var portfolioSchema = mongoose.Schema({
  username:{type:String,required:true,unique:true},
  name:String,
  description:String});
  var Portfolio = mongoose.model('portfolio', portfolioSchema);

  module.exports = Portfolio;
