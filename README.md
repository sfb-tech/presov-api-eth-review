# Presov API
---
### Setup
* Setup DB in Postgres
```
CREATE DATABASE presov_api;
```
* Create `.env` and update `.env` with the appropriate values
```
cp .env.example .env
```
* Install dependencies and start server
```bash
nvm use 10
yarn install
make db-migrate
make start-local
```

### KYC NETKI Access Code seeding
```
INSERT INTO netki_access_codes (access_code, created_at, updated_at)
VALUES ('testcode', NOW(), NOW());
```

#### Generate Identity
```
const EthCrypto = require('eth-crypto');
const identity = EthCrypto.createIdentity();
```
Result:
```
{ address: '0x096259a18e1f75bEB05ECe7D6738168a45f88129',
  privateKey:
   '0xd867837fe9edcb9a0453203f5c3724555a01066fdf21cef0ad7cfec964eb304b',
  publicKey:
   '4bfd90cd6ac05ab330c4316bf92522c92054dd823ca803b34f546107b714bcfc1a6f0f02459a8aa56e94f1a1570b15f7d014edaf05da4057c2d0596f7f66bf89' }
```

Sign Message Locally
```
const EthCrypto = require('eth-crypto');
const message = 'foobar';
const messageHash = EthCrypto.hash.keccak256(message);
const signature = EthCrypto.sign(
  '0xd867837fe9edcb9a0453203f5c3724555a01066fdf21cef0ad7cfec964eb304b', // privateKey
  messageHash // hash of message
);
```
#### User

##### Register User - POST /users/register

```
{
	first_name: '',
	last_name: '',
	username: '',
	email: '',
	user_registered: true
}
```

### Setup

#### Forego
Check if `forego` is present by typing it into the command line
Refer to `https://dl.equinox.io/ddollar/forego/stable` for installation if the commands below do not work
```
curl -O https://bin.equinox.io/c/ekMN3bCZFUn/forego-stable-darwin-amd64.zip
unzip forego-stable-darwin-amd64.zip -d /usr/local/bin
```

#### Application config
```
cp .env.example .env # fill in the correct info for DATABASE_URL
forego start
```

### Migrations

#### Seed Admin user in Postgres

```
INSERT INTO users (first_name, last_name, username, email, is_admin, active)
VALUES ('Timothy', 'Chung', 'tim', 'tim@example.com', true, true);
```

#### Run all migrations


##### Using Make
```
export DATABASE_URL='postgres://username:@localhost:5432/presov-api' && make db-migrate
```

##### Using CLI
```
export DATABASE_URL='postgres://username:@localhost:5432/presov-api'
node_modules/.bin/sequelize db:migrate
```

#### Create a new migration 
```
export DATABASE_URL='postgres://username:@localhost:5432/presov-api'
node_modules/.bin/sequelize migration:create --name=create_tablename
```
or
```
cp migrations/20170707171953-add_organizations.js migrations/timestamp-name-of-migration.js
```
NOTE: Make sure old migration names ARE NOT CHANGED!
#### Run migration locally
```
make db-migrate
```

### Run migration on DO Prod
```
make prod-db-migrate
```
### Deploy to Heroku for dev
```
heroku login # type in email and password, this is a one time operation
git remote add dev https://git.heroku.com/presov-api.git
git push dev master
```

### Start Postgres with Docker

```
docker run -d -e POSTGRES_USER=customuser -e POSTGRES_PASSWORD=custompass -e POSTGRES_DB=pgdbname -v /var/esr/pgdata:/var/lib/postgresql/data -p 5432:5432 --log-opt max-size=50m postgres:9.5
```

