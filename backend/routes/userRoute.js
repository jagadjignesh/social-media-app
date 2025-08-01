const express = require("express");
const userController = require('../controllers/userController');
const router = express.Router();
const userAuth = require("../middlewares/userMiddleware");

router.post('/login',userController.login);
router.post('/register',userController.register);
router.post('/user',userController.alluser);
router.post('/logout',userController.logout);
// router.post('/send-verify-email', userController.sendVerifyEmail);
router.post('/verify-account', userController.verifyAccount);
router.post('/send-reset-password-email', userController.sendResetPasswordEmail);
router.post('/reset-password', userController.resetPassword);


module.exports = router;