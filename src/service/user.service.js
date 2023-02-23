const catchAsync = require("../middleware/catchAsync")
const User = require("../model/user.model")
const Token = require("../model/userver.model")
const sendMail=require('../utils/sendMail')
const ErrorHandler=require("../utils/errorHandler")
const crypto =require('crypto')
const token=require("../utils/jwtVerification")

///for create account
exports.createAccount=catchAsync(async(req,res,next)=>{
    const {name , email , password} = req.body;

    ///Checking if any fields are empty
    if(!name || !email || !password){
      return next(new ErrorHandler("Please enter the required fields",404))
      }
      //saving the data to the database
      const user= await User.create({
      name,email,password
  })
const newtoken = crypto.randomBytes(32).toString("hex");
  const adtoken = await Token.create({
    userId: user._id,
    token: newtoken,
  })
  

  const message = `${process.env.BASE_URL}/api/v1/verify/${user._id}/${newtoken}`;
  try {
   
  
      await sendMail({
        email: user.email,
        subject: `Sneaker Head Verification Mail`,
        message,
      });
  
   token(user,201,res)
      
    } catch (error) {
    
      console.log(error)
    }
  
   })

//For verify account
exports.verifyacc=catchAsync(async(req,res,next)=>{
    try {
        const user = await User.findOne({ _id: req.params.id });
        
        if (!user) return res.status(400).send("Invalid link");
    
        const token = await Token.findOne({
          userId: user._id,
          token: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link");
     
    
        await User.findByIdAndUpdate( req.params.id, {is_verified: true });
        await Token.findByIdAndRemove(token._id);
    
        res.send("email verified sucessfully");
      } catch (error) {
        console.log(error)
        res.status(400).send("An error occured");
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
    if(user.is_verified ===false){
      return next(new ErrorHandler("Pending Account. Please Verify Your Email!",401))
    }

  
  
    const isPasswordMatched = await user.comparePassword(password);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
    token(user,200,res)
    
   
  });
    
// Forgot Password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendMail({
      email: user.email,
      subject: `Sneaker Heads Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password
exports.resetPassword = catchAsync(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});
