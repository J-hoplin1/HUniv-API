const mongoose = require('mongoose');

const { Schema } = mongoose;

const apikeySchema = new Schema({
    userid: {
        type: String,
        required: true,
        unique: true,
    },
    apikey: {
        type: String,
        required: true,
        unique: true,
    },
    expireAt: {
        type: Date,
        expires: `${process.env.API_KEY_EXPIRE}d`,
        default: Date.now(),
    },
});

module.exports = mongoose.model('apikey', apikeySchema);
