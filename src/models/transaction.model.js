const { Schema } = require('mongoose');
const db = require('../database/mongo');

const transactionSchema = new db.Schema({
    username : {
        type : String,
        ref : 'user'
    },

    amount : Number,

    description: String,    

    category: { 
        type: Schema.Types.ObjectId, 
        ref: 'categorys'
    },
    

    type: {
        type: String,
        enum: ['income', 'expense']
    },

    
    account: {
        type : Schema.Types.ObjectId,
        ref : 'account'
    }
},
    {
        timestamps: true
    }
);

const transaction = db.model('transaction', transactionSchema);

module.exports = transaction;