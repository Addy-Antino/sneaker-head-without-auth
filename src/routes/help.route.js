const express= require('express')
const {ifAuthenticateduser} = require('../middleware/auth')
const {raiseHelp} =require('../controller/help.controller')

const router =  express.Router()
//route for raising help
router.route('/help').post(ifAuthenticateduser,raiseHelp)

module.exports=router