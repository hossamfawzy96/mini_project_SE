var mongoose = require("mongoose");
mongoose.Promise = Promise;

var portfolioSchema = mongoose.Schema({
  username:String,
  title:String,
  link:String});
  var Portfolio = mongoose.model('portfolio_details', portfolioSchema);

  module.exports = Portfolio;
