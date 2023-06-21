const router = require('express').Router();
require('dotenv').config();
const { Form, User, Exam } = require('../models');



/*
    API Tìm bài thi bằng user_id
    Method: [GET]
    Params: uid
    Output: Bài thi của 1 thí sinh bất kì
*/
router.get('/readForm/:uid', async (req, res, next) => {
    const { uid } = req.params;

    let form = await Form.findOne({user: uid})
        .then(form => {
            return form.lean();
        })
        .catch(err => {
            return null
        })

    if(!form) {
        return res.status(404).json({success: false, msg: 'Không tìm thấy bài làm'});
    }

    if(form.status == 'submitted') {
        return res.status(300).json({success: false, msg: 'Bài làm đã nộp'});
    }

    return res.status(200).json({success: true, msg: 'Tìm thấy bài làm'});
})


/*
    API bắt đầu thi của 1 học sinh ( Tạo form thi )
    Method: [POST]
    Body: uid, exam_id
    Output: Khởi tạo 1 phiếu làm bài cho thí sinh
*/
router.post('/createForm', async (req, res, next) => {
    const { uid, exam_id } = req.body;
    
    let user = await User.findById(uid);
    if(!user) {
        return res.status(404).json({success: false, msg: 'Không tìm thấy học sinh'});
    }

    let exam = await Exam.findById(exam_id);
    if(!exam) {
        return res.status(404).json({success: false, msg: 'Không tìm thấy cuộc thi'});
    }

    let answers = new Map();
    for (let i = 0; i < exam.quizzes.length; i++) {
        answers.set(exam.quizzes[i], null);
    }
    let form = new Form({user, exam, answers, status: 'On Progress'});
    
    try {
        await form.save();
        return res.status(200).json({success: true, data: form, msg: 'Tạo bài làm thành công'});
    } catch (error) {
        return res.status(500).json({success: false, msg: 'Tạo bài làm thất bại'});
    }
})

/*
    API cập nhật tiến trình làm bài của học sinh liên tục 
    Method: [PUT]
    Body: form_id, quiz_id, new_answer
*/
router.put('/updateForm', async (req, res, next) => {
    const { form_id, quiz_id, new_answer } = req.body;

    let form = await Form.findById(form_id);
    
    if(!form) {
        return res.status(404).json({success: false, msg: 'Không tìm thấy bài làm'});
    }

    if(form.status == 'submitted') {
        return res.status(300).json({success: false, msg: 'Bài làm đã nộp'});
    }

    try {
        form.answers[quiz_id] = new_answer;
        await form.save();
        return res.status(200).json({success: true, msg: 'Cập nhật bài làm thành công'});
    } catch (error) {
        return res.status(500).json({success: false, msg: 'Cập nhật bài làm thất bại'});
    }

})


/*
    API nộp bài thi ( Submit bài thi ) 
    Method: [PUT]
    Body: form_id
    Output: Update trạng thái của bài thi -> submitted
*/
router.put('/submitForm', async (req, res, next) => {
    const { form_id } = req.body;

    let form = await Form.findById(form_id);

    if(!form) {
        return res.status(404).json({success: false, msg: 'Không tìm thấy bài thi'});
    }

    try {
        form.status = 'submitted';
        await form.save();
        return res.status(200).json({success: true, msg: 'Nộp bài thi thành công'});
    } catch (error) {
        return res.status(500).json({success: false, msg: 'Nộp bài thi thất bại'});
    }
    
})


/*
    API hủy phiếu thi của học sinh
    Method: [DELETE]
    Body: form_id
*/
router.delete('/removeForm', async (req, res, next) => {
    const { form_id } = req.body;

    await Form.findByIdAndRemove(form_id)
        .then(form => {
            if(form) {
                return res.status(200).json({success: true, msg: 'Hủy bài thi thành công'});
            }

            return res.status(404).json({success: false, msg: 'Không tìm thấy bài thi'});
        })
        .catch(err => {
            return res.status(500).json({success: false, msg: 'Hủy bài thi thất bại'});
        })
})

module.exports = router;