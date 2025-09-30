const express=require('express');
const router=express.Router();
const authController = require('../controllers/auth.contoller');

router.post('/user/register',authController.registerUser)//iis route pe aake hume is controller ka registerUser function call karna hai
router.post('/user/login', authController.loginUser)

module.exports = router;