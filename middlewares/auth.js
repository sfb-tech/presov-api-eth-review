var models  = require('../models');
var jwt = require('jsonwebtoken');
var Sequelize = require("sequelize");
var constants = require('../config/constants')
var auth = {}

auth.checkToken = function(req, res, next) {
	
   try {

  	var accessToken = req.header("Authorization")
  	if(accessToken == "" || accessToken == undefined || accessToken == null) {
  		accessToken = req.query.access_token
  	} else {
  		accessToken = accessToken.replace("Bearer ", "")
  	}
  	  	
    var decoded = jwt.verify(accessToken, constants.JWT_SECRET);
    req.currentUser = decoded.user

    next();
  } catch(err) {
    res.status(401);
    res.json({error: err})
  }
}

module.exports = auth;