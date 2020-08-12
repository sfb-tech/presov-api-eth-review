var express = require('express');
var path    = require("path");
var app = express();
var bodyParser = require('body-parser');
var Sequelize = require("sequelize");
var models = require('./models');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var usersController  = require('./controllers/users');
var ethAddressesController  = require('./controllers/eth_addresses');

const PORT = process.env.PORT || 4000;

app.use(express.static('public'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000
}));

app.use('/api/users', usersController);
app.use('/api/eth_addresses', ethAddressesController);

// app.use('/api/public_keys', publicKeysController);
// app.get('*', function (req, res) {
//   res.sendFile(path.join(__dirname + '/public/index.html'));
// });

var server = app.listen(PORT, function() {
  var port = server.address().port;
  console.log('Started server at port: ', port);
});
