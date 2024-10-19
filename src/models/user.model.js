const db = require('../database/mongo');

const user = db.model('user', {username: String, password: String});

module.exports = user;
