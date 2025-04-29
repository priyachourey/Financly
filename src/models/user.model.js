const Schema = require('mongoose');
const db = require('../database/mongo');

const userSchema = new db.Schema({
    username : {
        type : String,
        required : true
    },

    password : {
        type : String,
        required : true
    },

    email: {
        type : String,
        required :true,
        unique : true,
    },

    sharedIds : [{
            type : Schema.Types.ObjectId ,
            ref : "account"
    }]
})

const user = db.model('user', userSchema);

module.exports = user;
