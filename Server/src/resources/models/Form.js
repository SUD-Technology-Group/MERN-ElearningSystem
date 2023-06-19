const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Form = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    exam: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
    answers: [ {
        quiz: { type: Schema.Types.ObjectId, ref: 'Quiz' },
        choise: { type: String }
    }],
    status: { type: String, required: true }
},
{
    timestamps: true
})

module.exports = mongoose.model('Form', Form);