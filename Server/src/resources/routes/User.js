const router = require('express').Router();
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

router.get('/', (req, res, next) => {
    return res.json({result: 'pass'});
})

router.get('/getUser/:id', (req, res, next) => {
    const { id } = req.params;
    return res.json({id, user: 'Kuo Nhan Dung'})
})


router.post('/register', async (req, res, next) => {
    const { username, password, role, info, register_code } = req.body;

    if(!register_code) {
        return res.status(300).json({success: false, msg: 'Vui lòng nhập mã xác thực'});
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



module.exports = router;