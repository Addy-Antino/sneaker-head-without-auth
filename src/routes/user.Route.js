const express= require('express');
const { createAccount, loginforUser } = require('../controllers/user.controller');

const router = express.Router();
router.route('/register').post(createAccount)
router.route('/login').post(loginforUser)

module.exports=router