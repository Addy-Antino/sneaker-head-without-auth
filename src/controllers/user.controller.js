const catchAsync = require("../middleware/catchAsync")
const User = require("../model/user.model")
const sendMail=require('../utils/sendMail')
const ErrorHandler=require("../utils/errorHandler")
const { use } = require("../app")


///for create account
exports.createAccount=catchAsync(async(req,res,next)=>{
    const {name , email , password} = req.body;
    
    const user= await User.create({
        name,email,password
    })
const token = user.getJWTToken();
const message = `Welcome and Thanks for registering  ${user.name}  \n\nIf you have not requested this email then, please ignore it.`;
try {

    await sendMail({
      email: user.email,
      subject: `Sneaker Heads Verification Mail`,
      message,
    });

    res.status(201).json({
        success:true,
        token,
    })
    
  } catch (error) {
  
    console.log("email not sent")
  }
})

//Login for user

exports.loginforUser=catchAsync(async(req,res,next)=>{
    const { email, password } = req.body;

    
  
    if (!email || !password) {
      return next(new ErrorHandler("Please Enter Email & Password", 400));
    }
  
    const user = await User.findOne({ email }).select("+password");
  
  
    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
  
    const isPasswordMatched = await user.comparePassword(password);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
    res.status(200).json({
        success:true,
        user,
    })
    
   
  });
    

