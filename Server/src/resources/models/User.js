const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
    Model lưu trữ dữ liệu người dùng
    Các dữ liệu cần lưu trong model: 
        1. Tên đăng nhập ( username )
        2. Mật khẩu ( password )
        3. Vai trò ( role ) 
        4. Thông tin của ng dùng ( info - tạm thời quy định là 1 object và không bắt buộc )
*/ 

const User = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    info: { type: Object },
    
},
{
    timestamps: true
})

module.exports = mongoose.model('User', User);