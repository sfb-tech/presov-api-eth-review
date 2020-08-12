var models  = require('../models');
var express = require('express');
var jwt = require('jsonwebtoken');
var Sequelize = require("sequelize");
var utils = require("../utils/utils");
var publicKeysController  = express.Router();
var constants = require("../config/constants")
var auth = require('../middlewares/auth');
var smartContractClient = require('../smart_contract_client/client');
const EthCrypto = require('eth-crypto');
var randomstring = require("randomstring");

publicKeysController.post('/register', auth.checkToken, async function(req, res) {
  
  var publicKeyStr = req.body.public_key
  var userID = req.currentUser.id

  try {
    var publicKey = await models.PublicKey.findOne({where: {public_key: publicKeyStr, user_id: userID}})
    res.status(200)
    return res.json({
      id: publicKey.id,
      public_key: publicKey.public_key,
      verify_message: publicKey.verify_message,
    })
  } catch(err) {
    var verifyMessage = randomstring.generate()
    var pubKey = models.PublicKey.build({
      public_key: publicKeyStr,
      user_id: userID,
      verify_message: verifyMessage,
      verified: false,
    });
    pubKey.save().then(function(saved) {
      // TODO(tim): save public_key and generate a verify_message that the user needs to sign
      res.status(200)
      res.json({
        id: saved.id,
        public_key: publicKeyStr,
        verify_message: verifyMessage,
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
  }

  

  
});

publicKeysController.post('/verify_signature', auth.checkToken, async function(req, res) {
  var publicKeyStr = req.body.public_key
  try {
    var publicKey = await models.PublicKey.findOne({where: {public_key: publicKeyStr, user_id: req.currentUser.id}})
    var pubKey = publicKey.get('public_key')
    var signature = req.body.signature
    var verifyMessage = publicKey.get('verify_message')
    var wrappedMsg = "\x19Ethereum Signed Message:\n" + verifyMessage.length + verifyMessage
    var signerPubKey = ''
    try {
      signerPubKey = EthCrypto.recoverPublicKey(
        signature, // signature
        EthCrypto.hash.keccak256(wrappedMsg), // message hash
      )
    } catch(err) {
      res.status(400)
      return res.json({
        error: "Invalid signature",
      })
    }

    if(pubKey === signerPubKey) {
      publicKey.verified = true
      try {
        var _ = await publicKey.save()
        res.status(200)
        // TODO(tim):
        // Integrate with presov smart contract contract approval method
        console.log("Calling smartcontract to add address")
        var address = EthCrypto.publicKey.toAddress(pubKey);
        var network = "rinkeby"
        var result = await smartContractClient.addToWhiteList(address, network)
        console.log(result)
        return res.json({
          message: "Signature verified",
        })
        
      } catch(err) {
        res.status(400);
        return res.json({
          error: err,
        })
      }

    } else {

      res.status(400)
      return res.json({
        error: "Invalid signature",
      })
    }
    
  } catch(err) {
    res.status(400);
    return res.json({
      error: "Unknown Public Key",
    })
  }

 
});



publicKeysController.get('/list', auth.checkToken, async function(req, res) {
  try {
    let publicKeys = await models.PublicKey.findAll({where: {user_id: req.currentUser.id}})

    if(publicKeys) {
      res.status(200);
      return res.json({
        public_keys: publicKeys,
      })
    } else {
      res.status(400);
      return res.json({
        error: "Error getting public keys",
      })
    }
  } catch(e) {
    res.status(400);
    return res.json({
      error: e.message,
    })
  }
});


module.exports = publicKeysController;