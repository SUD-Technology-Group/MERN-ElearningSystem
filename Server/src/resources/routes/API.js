const router = require('express').Router();
const userRouter = require('./User')
const formRouter = require('./Form')

router.use('/users', userRouter);
router.use('/form', formRouter);

module.exports = router;