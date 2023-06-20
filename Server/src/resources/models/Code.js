const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Code = new Schema({
    
},
{
    timestamps: true
})

module.exports = mongoose.model('Code', Code);