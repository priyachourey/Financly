const { Schema } = require('mongoose');
const db = require('../database/mongo');

const transactionSchema = new db.Schema({
    username : String,
    amount : Number,
    category: { 
        type: Schema.Types.ObjectId, 
        ref: 'categorys'
    },
    description: String,
    type: {
        type: String,
        enum: ['income', 'expense']
    }
},
    {
        timestamps: true
    }
);

const transaction = db.model('transaction', transactionSchema);

module.exports = transaction;