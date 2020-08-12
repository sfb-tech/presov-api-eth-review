var models  = require('../models');
var express = require('express');
var jwt = require('jsonwebtoken');
var Sequelize = require("sequelize");
var utils = require("../utils/utils");
var ethAddressesController  = express.Router();
var constants = require("../config/constants")
var auth = require('../middlewares/auth');
var smartContractClient = require('../smart_contract_client/client');
const EthCrypto = require('eth-crypto');
var randomstring = require("randomstring");

ethAddressesController.post('/register', auth.checkToken, async function(req, res) {
  
  var ethAddressStr = req.body.address.toLowerCase()
  var userID = req.currentUser.id

  try {
    var ethAddress = await models.EthAddress.findOne({where: {address: ethAddressStr, user_id: userID}})
    res.status(200)
    return res.json({
      id: ethAddress.id,
      address: ethAddress.address,
      verify_message: ethAddress.verify_message,
    })
  } catch(err) {
    var verifyMessage = randomstring.generate()
    var ethAddr = models.EthAddress.build({
      address: ethAddressStr,
      user_id: userID,
      verify_message: verifyMessage,
      verified: false,
    });
    try {
      var savedEthAddr = await ethAddr.save()
      res.status(200)
      res.json({
        id: savedEthAddr.id,
        address: ethAddressStr,
        verify_message: verifyMessage,
      })
    
    } catch(err) {
      res.status(400)
      return res.json({
        error: err,
      })
    }
  }

  

  
});

ethAddressesController.post('/verify_signature', auth.checkToken, async function(req, res) {
  var ethAddressStr = req.body.address.toLowerCase()
  try {
    var ethAddress = await models.EthAddress.findOne({where: {address: ethAddressStr, user_id: req.currentUser.id}})
    console.log(ethAddress)
    var ethAddr = ethAddress.get('address').toLowerCase()
    var signature = req.body.signature
    var verifyMessage = ethAddress.get('verify_message')
    var wrappedMsg = "\x19Ethereum Signed Message:\n" + verifyMessage.length + verifyMessage
    var signerPubKey = ''
    try {
      var address = EthCrypto.recover(
        signature, // signature
        EthCrypto.hash.keccak256(wrappedMsg), // message hash
      )
    } catch(err) {
      res.status(400)
      return res.json({
        error: "Invalid signature",
      })
    }

    if(ethAddr === address.toLowerCase()) {
      ethAddress.verified = true
      try {
        var _ = await ethAddress.save()
        res.status(200)
        // Use presov smart contract contract approval method
        console.log("Calling Smart Contract to add address")
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
    console.log(err)
    res.status(400);
    return res.json({
      error: "Unknown Eth Address",
    })
  }

 
});



ethAddressesController.get('/list', auth.checkToken, async function(req, res) {
  try {
    let ethAddresses = await models.EthAddress.findAll({where: {user_id: req.currentUser.id}})

    if(ethAddresses) {
      res.status(200);
      return res.json({
        eth_addresses: ethAddresses,
      })
    } else {
      res.status(400);
      return res.json({
        error: "Error getting Eth Addresses",
      })
    }
  } catch(e) {
    res.status(400);
    return res.json({
      error: e.message,
    })
  }
});


module.exports = ethAddressesController;