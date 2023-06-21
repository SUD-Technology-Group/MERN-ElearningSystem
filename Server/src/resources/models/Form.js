const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
    Model lưu trữ bài thi của học sinh
    Các dữ liệu cần lưu trong model: 
        1. Id của học sinh ( user )
        2. Id của bài thi ( exam )
        3. Bài làm của học sinh ( answers ) - đối chiếu bằng index - answers['ed48j2jf2'] = 'A'
        4. Trạng thái của bài làm ( on progress, submited, canceled , ...)
*/ 

const Form = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    exam: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
    answers: { type: Map },
    status: { type: String, required: true }
},
{
    timestamps: true
})

module.exports = mongoose.model('Form', Form);