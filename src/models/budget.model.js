const { Schema } = require('mongoose');
const db = require('../database/mongo');

const budgetSchema = new db.Schema({
    username: String,
    amount: Number,
    name: String,
    description: String,
    expiry: Date,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category'
    }
},

{
    timestamps: true
}

)
const budget = db.model('budget', budgetSchema);

module.exports = budget;