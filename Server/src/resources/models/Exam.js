const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
    Model lưu trữ dữ liệu của bài thi
    Các dữ liệu cần lưu trong model: 
        1. Code của bài thi ( code )
        2. Tiêu đề bài thi ( title )
        3. Danh sách câu hỏi và các câu trả lời ( quizzes )
        4. Tác giả của bài thi ( createdBy - Có thể là thầy/cô hoặc 1 role nào đó có cấp bậc cao hơn )
        5. Trạng thái của bài làm ( on progress, ended, canceled, ... )
*/ 

const Exam = new Schema({
    code: { type: String, required: true },
    title: { type: String, required: true },
    quizzes: [ { type: Schema.Types.ObjectId, ref: 'Quiz' } ],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, required: true }
},
{
    timestamps: true
})

module.exports = mongoose.model('Exam', Exam);