'use strict';

module.exports = {
  up: function (migration, DataTypes) {
    return migration.sequelize.query(`
      CREATE TABLE netki_access_codes (
        id SERIAL PRIMARY KEY,
        access_code VARCHAR(255) UNIQUE,
        claimed BOOLEAN DEFAULT FALSE,
        user_id INTEGER REFERENCES users(id),
        claimed_at TIMESTAMP,
        created_at TIMESTAMP,
        updated_at TIMESTAMP
      )

    `);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('netki_access_codes');
  }
};
