const catchAsync = require("../middleware/catchAsync");
const Help = require("../service/help.service");
const ErrorHandler = require("../utils/errorHandler")

exports.raiseHelp = catchAsync(async(req,res,next)=>{
const name =req.body.name;
const email =  req.body.email;
const subject = req.body.subject;
const message  =req.body.message;
const help = await Help(name,email,subject,message)
res.status(201).json({
    success:true,
    help
})
})

