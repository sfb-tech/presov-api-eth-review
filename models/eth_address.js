"use strict";

// CREATE TABLE eth_addresses (
//   id SERIAL PRIMARY KEY,
//   user_id INTEGER REFERENCES users(id),
//   address TEXT,
//   verified BOOLEAN DEFAULT FALSE,
//   verify_message TEXT
// )
module.exports = function(sequelize, DataTypes) {
  
  var EthAddress = sequelize.define('EthAddress', {
    verify_message: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,           // don't allow empty strings
      }, 
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      }, 
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }, 
    },
    verified: DataTypes.BOOLEAN,
  }, {
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,
    // don't delete database entries but set the newly added attribute deletedAt
    // to the current date (when deletion was done). paranoid will only work if
    // timestamps are enabled
    paranoid: true,
    // don't use camelcase for automatically added attributes but underscore style
    // so updatedAt will be updated_at
    underscored: true,
    // disable the modification of tablenames; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,
    // define the table's name
    tableName: 'eth_addresses'
  })

  return EthAddress;
};

