const db = require('mongoose');
const config = require('../utils/config');
const logger = require('../utils/logger');
try {
  db.connect(config.DATABASE_URL, {
    authSource: config.DATABASE_AUTH_SOURCE,
    auth: {username: config.DATABASE_USER, password: config.DATABASE_PASSWORD},
    dbName: config.DATABASE_NAME,
  });
} catch (err) {
  logger.error(err);
}


module.exports = db;
