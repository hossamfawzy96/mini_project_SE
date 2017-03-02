
// require dependincies
var express = require('express');
var router = express.Router();
var visitor = require('./controll/visitorControl');
var multer  = require('multer');
var crypto = require('crypto');
var mime = require('mime');
var student = require('./controll/studentControl');

var storage = multer.diskStorage({  // for profile Pictures
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
    });
  }
});
var upload = multer({ storage: storage }); // for profilePictures


var storage_screen = multer.diskStorage({  // for screenshots
  destination: function (req, file, cb) {
    cb(null, './public/screenshots')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
    });
  }
});
var upload_screen = multer({ storage: storage_screen }); // for screenshots


// add visitor routes
router.get('/', visitor.getAllPortf);
router.post('/', visitor.getAllPortf);
router.get('/signup',visitor.signup);
router.post('/profile',visitor.login);
router.get('/profile',visitor.login);
router.post('/newProfile',upload.array('pic'),visitor.createAccount);
router.post('/details',visitor.details);

//add student routes
router.get('/myPortfolio',student.myPortfolio);
router.get('/addProjects',student.addProjects);
router.get('/addProjects_Screen',student.addProjects_Screen);
router.post('/createProject_link',student.createProject_link);
router.post('/createProject_screen',upload_screen.array('screen'),student.createProject_screen);

// export router

module.exports = router;
