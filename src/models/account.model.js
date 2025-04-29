const Schema = require('mongoose');
const db = require('../database/mongo')

const accountSchema = new db.Schema({
    name : {
        type : String,
        required : true,
    },

    owner: { 
        type: Schema.Types.ObjectId, 
        ref: "user",
    },

    members: [{ 
            type : Schema.Types.ObjectId,
            ref : "user"
    }],
});
const account = db.model('account', accountSchema);

module.exports = account;