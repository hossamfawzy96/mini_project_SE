let User = require('../model/user');
let PP = require('../model/pp');
var fs = require('fs');
var path = require('path');
let Portfolio = require('../model/portfolio');
let Details = require('../model/portfolio_details');

let visitorController = {
  details: function(req,res){
    Portfolio.find({username:req.body.details},function(err,result){
      if(err)
      res.send(err.message);
      else{
        Details.find({username:req.body.details},function(err,det){

          if(err)
          res.send(err.message);
          else{
            var pp_path="";
            PP.find({"username" : req.body.details}, function(err,resul){
              if(err)
              res.send(err.message);
              else{
                pp_path = resul[0].path;
                res.render('details', {result,det,pp_path,type:req.session.type,src:req.session.PP});
              }
            });

          }
        });



      }
    });
  },
  getAllPortf:function(req, res){
    Portfolio.find(function(err,result){
      if(req.session.loged){
        req.session.destroy();
        req.session ={};
        req.session = null;
      }
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');
      if(err)
      res.send(err.message);
      else{
        var tmp = 0;
        if(!req.body.index)
        tmp = 1;
        else
        tmp = req.body.index;
        var count = Math.floor(result.length / 10);
        if(result.length % 10 > 0)
        count = count+1;
        var start = (tmp-1) * 10;
        var end = tmp == count ? result.length : tmp * 10;
        var active = tmp;
        res.render('index',{err:"",result,start, end, count,active});
      }
    });

  },

  login : function(req,res){
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    var portosvar ="";
    var count = 0;
    var start = 0;
    var end = 0;
    var active = 0;
    Portfolio.find(function(err,portos){
      if(err)
      res.send(err.message);
      else{
        var tmp = 0;
        if(!req.body.index)
        tmp = 1;
        else
        tmp = req.body.index;
        count = Math.floor(portos.length / 10);
        if(portos.length % 10 > 0)
        count = count+1;
        start = (tmp-1) * 10;
        end = tmp == count ? portos.length : tmp * 10;
        active = tmp;
        portosvar = portos;
      }
      });

    Portfolio.find({username : req.body.username},function(err,result){
      if(result.length == 0)
      req.session.have_port = false;
      else{
      req.session.have_port = true;
}
    });
    if(req.session.loged){
      let pp_path = "";
      PP.find({"username" : req.session.user}, function(err,result){
        if(err)
        res.send(err.message);
        else{
          pp_path = result[0].path;
        }
        //            projects = req.p;
        if(req.session.type == "client")
        res.render('clientProfile',{count,start,end,active,portosvar,err:"",un:req.session.user,type:req.session.type,src: pp_path,newP:0});
        else{
          res.render('studentProfile',{count,start,end,active,portosvar,err:"",un:req.session.user,type:req.session.type,src: pp_path, newP:0});
        }
      }) ;
    }
    else
    {

      User.find({"username": req.body.username},function(err, result){
        if(err)
        res.send(err.message);
        else if(result == 0){
          res.render('index',{err: "enter a valid username.....Or Signup if you do not have an account",result:portosvar,start, end, count,active});
          return;
        }
        else if(!req.body.password){
          res.render('index',{err: "enter yout password",result:portosvar,start, end, count,active});
          return;
        }
        else if(req.body.password == result[0].password && !req.flag){
          req.session.user = req.body.username;
          req.session.loged = true;
          req.session.type = result[0].type;
          let pp_path = "";
          PP.find({"username" : req.body.username}, function(err,resultp){
            if(err)
            res.send(err.message);
            else{
              pp_path = resultp[0].path;
            }
            req.session.PP = pp_path;
            if(result[0].type == "client")
            res.render('clientProfile',{count,start,end,active,portosvar,err:"",un:result[0].username,type:result[0].type,src: pp_path,newP:0});
            else{
              res.render('studentProfile',{count,start,end,active,portosvar,err:"",un:result[0].username,type:result[0].type,src: pp_path, newP:0});
            }
          }) ;

        }
        else{
          //projects = req.p;
          res.render('index',{err: "wrong password",result:portosvar,start, end, count,active});
        }

      });
    }
  },
  signup: function(req,res){
    res.render("signup",{err:"5",});
  },
  createAccount: function(req,res){
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    var portosvar = "";
    var count = 0;
    var start = 0;
    var end = 0;
    var active = 0;
    Portfolio.find(function(err,portos){
      if(err)
      res.send(err.message);
      else{
        var tmp = 0;
        if(!req.body.index)
        tmp = 1;
        else
        tmp = req.body.index;
        count = Math.floor(portos.length / 10);
        if(portos.length % 10 > 0)
        count = count+1;
        start = (tmp-1) * 10;
        end = tmp == count ? portos.length : tmp * 10;
        active = tmp;
        portosvar = portos;
      }
    });

    //checking for Exceptions
    if(!req.body.username){
      res.render('signup',{err:"ERROR: Username is empty",un:""});
      return;
    }
    else if(!req.body.password){
      res.render('signup',{err:"ERROR: password is empty",un :req.body.username});
      return;
    }
    else if(!req.body.password1){
      res.render('signup',{err:"ERROR: Enter password confirmation",un :req.body.username});
      return;
    }
    else if(req.body.password != req.body.password1){
      res.render('signup',{err:"ERROR: password doesnot match",un :req.body.username});
      return;
    }

    // creating record attributes
    var db_username = req.body.username;
    var db_password = req.body.password;
    var db_type = req.body.type;

    //checking if the username is unique
    var flag = 0;
    User.find({"username" : db_username}, function(err,result){
      if(result.length > 0){
        flag = 1;
      }
      else{
        flag = 0;
      }
      if(flag == 0){
        req.session.user = req.body.username;
        req.session.loged = true;
        req.session.type = db_type;
        var user = new User({"username" : db_username, "password" : db_password, "type" : db_type}); //creating record for user
        user.save(function(err,user){
          if(err)
          res.send(err.message);
          else{                                                  // checking for the profile image
            if(!req.files[0])
            var pp_path ="/public/images/default.png";
            else
            var pp_path = req.files[0].path;

            req.session.PP = pp_path;
            var pp = new PP({"username": db_username,"path":pp_path});   // creating record for user profile picture
            pp.save(function(err,pp){
              if(err)
              res.send(err.message);
              else if(db_type == "client")
              res.render('clientProfile',{count,start,end,active,portosvar,err:0, un:db_username ,type: db_type , src: pp_path,newP:1});
              else
              res.render('studentProfile',{count,start,end,active,portosvar,err:0, un:db_username ,type: db_type, src: pp_path,newP:1});
            })

          }

        })
      }else{
        res.render('signup',{err:"username is already taken choose another one", un:""});

      }

    });

  }
}
module.exports = visitorController;
