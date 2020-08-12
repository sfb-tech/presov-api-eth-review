db-migrate:
	touch .env && set -a && . .env && node_modules/.bin/sequelize-cli db:migrate
db-rollback:
	touch .env && set -a && . .env && node_modules/.bin/sequelize-cli db:migrate:undo
start-local:
	set -a && . .env && node_modules/.bin/nodemon server.js