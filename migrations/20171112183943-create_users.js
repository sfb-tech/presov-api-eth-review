'use strict';

module.exports = {
  up: function (migration, DataTypes) {
    return migration.sequelize.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        username VARCHAR(255) UNIQUE,
        email VARCHAR(255) UNIQUE,
        is_admin BOOLEAN DEFAULT FALSE,
        active BOOLEAN DEFAULT FALSE,
        kyc_status VARCHAR(255),
        kyc_provider VARCHAR(255),
        netki_access_code VARCHAR(255),
        encrypted_password TEXT,
        created_at TIMESTAMP,
        updated_at TIMESTAMP
      )

    `);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('users');
  }
};
