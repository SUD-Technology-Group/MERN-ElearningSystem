const router = require('express').Router();
require('dotenv').config();
const { User, OTP } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const RegisterCode = require('../models/RegisterCode');
const secretKey = 'sudtechnology';
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;
  
    if (token) {
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            success: false,
            message: 'Token không trùng khớp'
          });
        }
  
        req.user = decoded;
        next();
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Token không có sẵn'
      });
    }
}

const accountSid = process.env.ACCOUNT_SID || '';
const authToken = process.env.AUTH_TOKEN || '';
const twilio_phone = '+12179552595';
const client = require('twilio')(accountSid, authToken);

router.get('/', (req, res, next) => {
    return res.json({result: 'pass'});
})


router.post('/register', async (req, res, next) => {
    const { username, password, role, info, register_code } = req.body;

    if(!register_code) {
        return res.status(300).json({success: false, msg: 'Vui lòng nhập mã xác thực'});

    }

    let code = await RegisterCode.findOne({code: register_code})

    if(!code) {
        return res.status(300).json({success: false, msg: 'Mã xác thực không tồn tại'});
    }

    let user = await User.findOne({username})
    
    if(user){
        return res.status(300).json({success: false, msg: 'Tài khoản đã tồn tại'});
    }

    bcrypt.hash(password, 10, async (err, hashedPassword) => {
        if(err)
            return res.status(500).json({success: false, msg: 'Hashing fail'});

        try {
            let user = await new User({username, password: hashedPassword, info, role}).save();
            return res.status(200).json({success: true, data: user, msg: 'Tạo tài khoản thành công'});
        }
        catch (err) {
            return res.status(500).json({success: false, msg: err})

        }
    })
})

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    let user = await User.findOne({username})
    
    if(!user){
        return res.status(300).json({success: false, msg: 'Tài khoản không tồn tại'});
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Lỗi hệ thống',
            });
        }

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Mật khẩu không chính xác',
            });
        }

        // Tạo JWT
        const payload = {
            username: user.username,
        };

        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

        return res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công',
            token: token,
        });
    });
})


/* 
    Số điện thoại bắt đầu = +84
    Sample: +84767916592
    Vì là tài khoản Trial nên tạm thời chỉ test được bằng số dt của anh.
    Có thể test trên postman để xem kết quả
*/
router.post('/send-OTP', async (req, res, next) => {
    const { uid, phone } = req.body;
    const code = Math.floor(1000 + Math.random() * 900000);

    client.messages.create({
        body: '' + code,
        from: twilio_phone,  // Số điện thoại đã xác minh trên Twilio
        to: phone  // Số điện thoại nhận SMS
    })
    .then(message => {
        try {
            new OTP({code: code, user: uid}).save();
            return res.json({success: true, msg: message});    
        } catch (error) {
            return res.json({success: false, msg: 'Gửi OTP thất bại'});
        }
    });
})



module.exports = router;