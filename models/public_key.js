"use strict";

// CREATE TABLE public_keys (
//   id SERIAL PRIMARY KEY,
//   user_id INTEGER REFERENCES users(id),
//   public_key TEXT,
//   verified BOOLEAN DEFAULT FALSE,
//   verify_message TEXT
// )
module.exports = function(sequelize, DataTypes) {
  
  var PublicKey = sequelize.define('PublicKey', {
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
    public_key: {
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
    tableName: 'public_keys'
  })

  return PublicKey;
};

