var models  = require('../models');
var express = require('express');
var jwt = require('jsonwebtoken');
var Sequelize = require("sequelize");
var utils = require("../utils/utils");
var usersController  = express.Router();
var constants = require("../config/constants")
var auth = require('../middlewares/auth');
var bcrypt = require('bcrypt');
const EthCrypto = require('eth-crypto');

var generateUserJWTToken = function(user) {
  var expireInMin = 1440;
  return jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * expireInMin),
    user: user
  }, constants.JWT_SECRET);
}

usersController.post('/register', function(req, res) {
  const saltRounds = 10
  var password = req.body.password
  isValid = utils.isValidPassword(password)
  if(isValid == false) {
    res.status(400); 
    res.json({
      error: "Invalid password",
    })
    return
  }

  var user = models.User.build({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    username: req.body.username.toLowerCase(),
    email: req.body.email.toLowerCase(),
  });

  
  var hash = bcrypt.hashSync(password, saltRounds);
  user.encrypted_password = hash
  user.save().then(function(saved) {
    res.json({
      id: saved.id,
    })
  }).catch(Sequelize.ValidationError, function (msg) {
    res.status(400);
    res.json({
      error: msg,
    })
  }).catch(function(err) {
    res.status(400); 
    res.json({
      error: err,
    })
  })
  
});

usersController.post('/sign_in', function(req, res) {

  models.User.findOne({where: {email: req.body.email}}).then(user => {
    var validPass = bcrypt.compareSync(req.body.password, user.encrypted_password)
    if(validPass == true) {
      res.status(200)
      user.encrypted_password = null;
      return res.json({
        msg: "OK",
        token: generateUserJWTToken(user),
      })
    } else {
       res.status(400)
      return res.json({
        error: "Invalid login",
      })
    }
    
  }).catch(function(err) {
    res.status(400);
    return res.json({
      error: err,
    })
  })
});

usersController.get('/me', auth.checkToken, function(req, res) {
  res.status(200)
  return res.json(req.currentUser)
});

usersController.post('/claim_netki_code', auth.checkToken, async function(req, res) {
  try {
    let user = await models.User.findOne({where: {id: req.currentUser.id}})

    if(user) {
      netkiAccessCode = user.netki_access_code 
      if(netkiAccessCode == null || netkiAccessCode == "") {
        let accessCode = await models.NetkiAccessCode.findOne({where: {claimed: false}})
        if(accessCode) {
          
          user.netki_access_code = accessCode.access_code
          accessCode.claimed = true
          accessCode.claimed_at = Date()
          accessCode.user_id = user.id

          let transaction;
          try {
            transaction = await models.sequelize.transaction();
            let savedAccessCode = await accessCode.save({transaction: transaction})
            let savedUser = await user.save({transaction: transaction})
            await transaction.commit();
            res.status(200)
            res.json({
              netki_access_code: savedAccessCode.access_code,
            })
          } catch(e) {
            if (transaction) await transaction.rollback();
            console.log(e.message)
            res.status(400); 
            res.json({
              error: e.message,
            })
          }
        } else {
          res.status(400); 
          res.json({
            error: "No access code available",
          })
        }
      } else {

        res.status(200)
        res.json({
          netki_access_code: netkiAccessCode,
        })
      }
    } else {
      res.status(400); 
      res.json({
        error: "Error getting user",
      })
    }
  } catch(e) {
    res.status(400); 
    res.json({
      error: e.message,
    })
  }
});

usersController.post('/update_netki_status', auth.checkToken, async function(req, res) {
  try {
    let user = await models.User.findOne({where: {id: req.currentUser.id}})

    if(user) {
      netkiAccessCode = user.netki_access_code 
      if(netkiAccessCode == null || netkiAccessCode == "") {
        res.status(400); 
        res.json({
          error: "Claim access code first",
        })
      } else {
        // TODO(tim):
        // call netki api for status only if status != "completed"
        // statuses_from_netki|approved
        // update user object
        // save into DB
        // return result
        res.status(200)
        res.json({
          kyc_status: user.kyc_status,
        })
      }
    } else {
      res.status(400); 
      res.json({
        error: "Error getting user",
      })
    }
  } catch(e) {
    res.status(400); 
    res.json({
      error: e.message,
    })
  }
});

usersController.post('/refresh_token', auth.checkToken, function(req, res) {

  res.json({
    token: generateUserJWTToken(req.currentUser),
  })

});

module.exports = usersController;