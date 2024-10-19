const db = require('../database/mongo');

const category = db.model('categorys', {
    name: String,
    username: String
});

module.exports = category;