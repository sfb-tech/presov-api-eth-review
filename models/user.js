"use strict";

// CREATE TABLE users (
// id SERIAL PRIMARY KEY,
// first_name VARCHAR(255),
// last_name VARCHAR(255),
// username VARCHAR(255),
// email VARCHAR(255),
// is_admin BOOLEAN DEFAULT FALSE,
// user_registered BOOLEAN DEFAULT FALSE,
// active BOOLEAN DEFAULT FALSE
// )
module.exports = function(sequelize, DataTypes) {
  
  var User = sequelize.define('User', {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,           // don't allow empty strings
      }, 
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,           // don't allow empty strings
      }, 
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,           // don't allow empty strings
      }, 
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true, 
      }, 
    },
    encrypted_password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }, 
    },
    kyc_provider: {
      type: DataTypes.STRING,
    },
    kyc_status: {
      type: DataTypes.STRING,
    },
    netki_access_code: {
      type: DataTypes.STRING,
    },
    is_admin: DataTypes.BOOLEAN,
    active: DataTypes.BOOLEAN,
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
    tableName: 'users'
  })

  return User;
};


