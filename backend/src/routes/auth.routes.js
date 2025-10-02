const express=require('express');
const router=express.Router();
const authController = require('../controllers/auth.contoller');
//user auth apis
router.post('/user/register',authController.registerUser)//iis route pe aake hume is controller ka registerUser function call karna hai
router.post('/user/login', authController.loginUser)
router.get('/user/logout', authController.logoutUser)
//foodpartner apis
router.post('/foodpartner/register', authController.registerFoodPartner)
router.post('/foodpartner/login', authController.loginFoodPartner)
router.get('/foodpartner/logout', authController.logoutFoodPartner)

module.exports = router;