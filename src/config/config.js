const p = process.env;

const config = {
  "development": {
    "username": p.MYSQL_ROOT_USER,
    "password": p.MYSQL_PASSWORD,
    "database": p.MYSQL_DATABASE,
    "host": p.MYSQL_SERVER,
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}

module.exports = config;