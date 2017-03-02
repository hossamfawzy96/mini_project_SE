//require depenciess
var express = require('express');
var router = require('./router');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var DB_URI = "mongodb://localhost:27017/portfolio";
var multer  = require('multer');
var path = require('path');
var session = require('express-session');
var app = express();


// configure app
app.set('view engine','ejs');



app.use('/public/images',express.static(path.join(__dirname+ '/public/images')));
app.use('/public/screenshots',express.static(path.join(__dirname+ '/public/screenshots')));




app.set('trust proxy', 1); // trust first proxy
app.set('views', path.join(__dirname+ '/public/views'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,

}));
mongoose.connect(DB_URI);
mongoose.Promise = Promise;
app.use(router);


// start the server
app.listen(8080, function(){
    console.log("server is listening on port 8080");
})
