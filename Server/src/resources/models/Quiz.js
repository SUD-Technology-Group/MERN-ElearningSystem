const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
    Model lưu trữ câu hỏi và các câu trả lời
    Các dữ liệu cần lưu trong model: 
        1. Câu hỏi ( question )
        2. Các câu trả lời ( answers )
        3. Index câu trả lời đúng ( correctIndex )
*/ 

const Quiz = new Schema({
    question: { type: String, required: true },
    answers: [{ type: String, required: true }],
    correctIndex: { type: Number, required: true }

},
{
    timestamps: true
})

module.exports = mongoose.model('Quiz', Quiz);