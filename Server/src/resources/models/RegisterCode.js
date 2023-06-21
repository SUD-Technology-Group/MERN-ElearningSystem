const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const RegisterCode = new Schema({
    code: { type: String, unique: true, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isAvailable: { type: Boolean, default: true }

})

module.exports = mongoose.model('RegisterCode', RegisterCode);