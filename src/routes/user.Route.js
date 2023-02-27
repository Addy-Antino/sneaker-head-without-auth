const express= require('express');
const { ifAuthenticateduser } = require('../middleware/auth');
const { createAccount, loginforUser,forgotPassword,verifyacc,resetPassword, getUserProfile, deleteUserProfile, logoutforuser, updatePassword, updateProfile } = require('../controller/user.controller');

const router = express.Router();
router.route('/register').post(createAccount)
router.route('/login').post(loginforUser)
router.route('/verify/:id/:token').get(verifyacc)
router.route('/logout').get(ifAuthenticateduser,logoutforuser)
router.route('/update/pass').put(ifAuthenticateduser,updatePassword)
router.route('/me/update').put(ifAuthenticateduser,updateProfile)
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/user/me").get(ifAuthenticateduser, getUserProfile)
router.route("/delete/user/me").delete(ifAuthenticateduser,deleteUserProfile)


module.exports=router
