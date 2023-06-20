const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OTP = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    code: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        expires: '90s',
        default: Date.now()
    }
})

module.exports = mongoose.model('OTP', OTP);