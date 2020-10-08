const path = require('path');
const BASE_PATH = path.join(__dirname, 'server', 'db');

require('dotenv').config();
const { POSTGRES_USERNAME, POSTGRES_PASSWORD, POSTGRES_DATABASE, POSTGRES_DATABASE_TEST } = process.env;

var postgres_host = `postgres://${POSTGRES_USERNAME}:${POSTGRES_PASSWORD}@localhost:5432`;

module.exports = {
  test: {
    client: 'pg',
    connection: `${postgres_host}/${POSTGRES_DATABASE_TEST}`,
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds')
    }
  },
  development: {
    client: 'pg',
    connection: `${postgres_host}/${POSTGRES_DATABASE}`,
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds')
    }
  },
  production: {
    client: 'pg',
    connection: `${postgres_host}/${POSTGRES_DATABASE}`,
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds')
    }
  }
};