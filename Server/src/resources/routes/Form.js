const router = require('express').Router();
require('dotenv').config();
const { Form, User, Exam } = require('../models');

router.get('/readForm/:uid', async (req, res, next) => {
    const { uid } = req.params;

    let form = await Form.findOne({user: uid}).lean();

    if(!form) {
        return res.status(404).json({success: false, msg: 'Không tìm thấy bài làm'});
    }

    if(form.status == 'submitted') {
        return res.status(300).json({success: false, msg: 'Bài làm đã nộp'});
    }

    return res.status(200).json({success: true, data: form, msg: 'Tìm thấy bài làm'});
})

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

router.put('/removeForm', async (req, res, next) => {
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