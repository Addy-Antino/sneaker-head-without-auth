const express= require('express');
const { createAccount, loginforUser,forgotPassword,verifyacc,resetPassword } = require('../service/user.service');

const router = express.Router();
router.route('/register').post(createAccount)
router.route('/login').post(loginforUser)
router.route('/verify/:id/:token').post(verifyacc)

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

module.exports=router
