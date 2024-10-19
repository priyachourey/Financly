const db = require('../database/mongo');


const goalSchema = new db.Schema({
    username: String,
    amount: Number,
    summary: String,
    expiry: Date
},
    {
        timestamps: true
    }
);

const goal = db.model('goal', goalSchema);

module.exports = goal;