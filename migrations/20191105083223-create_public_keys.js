'use strict';

module.exports = {
  up: function (migration, DataTypes) {
    return migration.sequelize.query(`
      CREATE TABLE public_keys (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        public_key TEXT,
        verified BOOLEAN DEFAULT FALSE,
        verify_message TEXT,
        created_at TIMESTAMP,
        updated_at TIMESTAMP
      )
    `);
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('public_keys');
  }
};
