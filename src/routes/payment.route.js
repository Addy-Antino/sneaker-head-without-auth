const express= require('express');

const {processPayment} =require("../controller/payment.controller")

const router = express.Router();

router.route('/payment').post(processPayment)

module.exports=router