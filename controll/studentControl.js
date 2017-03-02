let Portfolio = require('../model/portfolio');
let Link = require('../model/project_link');
let Screenshot = require('../model/project_screen');
let Details = require('../model/portfolio_details');

let Controll= {

	myPortfolio : function(req,res){
		Portfolio.find({username : req.session.user},function(err,result){
			if(result.length == 0 && !req.session.have_port){
				res.render('myPortfolio',{src : req.session.PP,center : "You do not have a portfolio yet",links:"",screen_result:""});
				req.session.have_port = false;
			}
			else{
				Link.find({username : req.session.user},function(err,link_result){
					if(err)
					res.send(err.message);
					else{
						links = link_result;
						Screenshot.find({username : req.session.user},function(err,screen_result){
							if(err)
							res.send(err.message);
							else
							res.render('myPortfolio',{src:req.session.PP, center:"",links,screen_result});
						})
					}
				})
			}

		});




	},

	addProjects : function(req,res){
		Portfolio.find({username : req.session.user},function(err,result){
			if(result.length == 0){
				res.render('addProjects',{src : req.session.PP,state:"project", center : "To create a portfolio you have to upload at least one project link or Screenshot",err:"",succ:""});
				req.session.have_port = false;
			}
			else
			res.render('addProjects',{src : req.session.PP,state:"project", center : "",err:"",succ:""});
		});

	},

	addProjects_Screen : function(req,res){
		Portfolio.find({username : req.session.user},function(err,result){
			if(result.length == 0)
			res.render('addProjects',{src : req.session.PP,state:"screen", center : "To create a portfolio you have to upload at least one project link or Screenshot",err:"",succ:""});
			else
			res.render('addProjects',{src : req.session.PP,state:"screen", center : "",err:"",succ:""});
		});

	},

	createProject_link: function(req,res){
		if(!req.body.name && !req.session.have_port)
		res.render('addProjects',{src : req.session.PP,state:"project", center : "To create a portfolio you have to upload at least one project link or Screenshot",err:"please enter your name",succ:""});
		else if(!req.body.title && !req.session.have_port)
		res.render('addProjects',{src : req.session.PP,state:"project", center : "To create a portfolio you have to upload at least one project link or Screenshot",err:"title is empty",succ:""});
		else if(!req.body.title)
		res.render('addProjects',{src : req.session.PP,state:"project", center : "",err:"title is empty",succ:""});
		else if(!req.body.URL && !req.session.have_port)
		res.render('addProjects',{src : req.session.PP,state:"project", center : "to create a portfolio you have to upload at least one project or Screenshot",err:"URL is empty",succ:""});
		else if(!req.body.URL)
		res.render('addProjects',{src : req.session.PP,state:"project", center : "",err:"title is empty",succ:""});

		else{
	      if(!req.session.have_port){
				let portfolio = new Portfolio({username : req.session.user, name : req.body.name, description: req.body.description});
				portfolio.save(function(err,result){
					if(err)
					res.send(err.message);
					else
					req.session.have_port = true;
				});
			}

			let link = new Link({title: req.body.title, URL: req.body.URL, username:req.session.user});
			Details.find({username:req.session.user},function(err,result){
				if(err)
				res.send(err.message);
				else if(result.length <2){
					var det = new Details({username: req.session.user,title:req.body.title,link:req.body.URL});
					det.save(function(err,result){
						if(err)
						res.send(err.message);
					});

				}
			});

			link.save(function(err,result){
				if(err)
				res.send(err.message);
				else if(req.body.name)
				res.render('addProjects',{src:req.session.PP,state:"project",center:"",err:"",succ:"portfolio created successfully and project added"});
				else
				res.render('addProjects',{src:req.session.PP,state:"project",center:"",err:"",succ:"porject added successfully"});
			});
		}
	},

	createProject_screen: function(req,res){
		if(!req.body.name && !req.session.have_port)
		res.render('addProjects',{src : req.session.PP,state:"screen", center : "To create a portfolio you have to upload at least one project link or Screenshot",err:"please enter your name",succ:""});
		else if(!req.body.title && !req.session.have_port)
		res.render('addProjects',{src : req.session.PP,state:"project", center : "To create a portfolio you have to upload at least one project link or Screenshot",err:"title is empty",succ:""});
		else if(!req.body.title)
		res.render('addProjects',{src : req.session.PP,state:"project", center : "",err:"title is empty",succ:""});
		else if(!req.files[0] && !req.session.have_port)
		res.render('addProjects',{src : req.session.PP,state:"project", center : "to create a portfolio you have to upload at least one project or Screenshot",err:"choose a Screenshot",succ:""});
		else if(!req.files[0])
		res.render('addProjects',{src : req.session.PP,state:"project", center : "",err:"choose a Screenshot",succ:""});
		else{
			if(!req.session.have_port){
				let portfolio = new Portfolio({username : req.session.user, name : req.body.name,description: req.body.description});
				portfolio.save(function(err,result){
					if(err)
					res.send(err.message);
					else
					req.session.have_port = true;
				});
			}
			var screen = new Screenshot({title : req.body.title, path: req.files[0].path, username:req.session.user});
			screen.save(function(err,result){
				if(err)
				res.send(err.message);
				else if(req.body.name)
				res.render('addProjects',{src:req.session.PP,state:"screen",center:"",err:"",succ:"portfolio created successfully and Screenshot added"});
				else
				res.render('addProjects',{src:req.session.PP,state:"screen",center:"",err:"",succ:"Screenshot added successfully"});
			});
			Details.find({username:req.session.user},function(err,result){
				if(err)
				res.send(err.message);
				else if(result.length <2){
					var det = new Details({username: req.session.user,title:req.body.title,link:req.files[0].path});
					det.save(function(err,result){
						if(err){
						res.send(err.message);
					}
					});

				}
			});



		}
	}

}

module.exports = Controll;
