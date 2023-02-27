const User = require("../model/user.model")
const Token= require("../model/userver.model")
const sendMail=require('../utils/sendMail')
const crypto =require('crypto')
const token=require("../utils/jwtVerification")
const tokenService = require('./token.service')
const ErrorHandler = require('../utils/errorHandler')

///for create account
const createAcc=async(name,email,password)=>{
    
    ///Checking if any fields are empty
   
      //saving the data to the database
      const user= await User.create({
      name,email,password
  })
  const verificationToken = await tokenService.generateErificationToken(user._id)


  const message = `${process.env.FRONT_URL}/api/v1/verify/${user._id}/${verificationToken.token}`;
  try {
   
  
      await sendMail({
        email: user.email,
        subject: `Snicker Head Verification Mail`,
        message,
      });
  
      return user;
  
      
    } catch (error) {
    
      console.log(error)
    }
  
   }

//For verify account
const verify=async(req,res,next)=>{
    // try {
        const user = await User.findOne({ _id: req.params.id });
        
        if (!user)  return next(new ErrorHandler("Invalid Link", 400));
    
        const token = await Token.findOne({
          userId: user._id,
          token: req.params.token,
        });
        if (!token) return next(new ErrorHandler("Invalid Link", 400));
       
     
    
        await User.findByIdAndUpdate( req.params.id, {is_verified: true });
        await Token.findByIdAndRemove(token._id);
        
       return  res.status(200).json({
          success:true,
          verified:true,
          message:'Email successfully verified'
        })
    
}

//Login for user

const login=async(email,password,req,res,next)=>{
    
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
    
   
  };

//Logout user

const logout =async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
};
    
// Forgot Password
const forgotPassword = async (req, res, next) => {
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
};

// Reset Password
const resetPassword = async (req, res, next) => {
 
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
  return next(new ErrorHandler("Password does not matched", 400));
}

user.password = req.body.password;
user.resetPasswordToken = undefined;
user.resetPasswordExpire = undefined;

await user.save();

token(user, 200, res);
};

//Update user password

const updatePassword = async(req,res,next)=>{
  const user =  await User.findById(req.user.id).select('+password')
  const ifPasswordMatched = await user.comparePassword(req.body.oldPassword)
 
  if(!ifPasswordMatched) {return next(new ErrorHandler("Old password is incorrect", 400));}

  if (req.body.newPassword !== req.body.confirmPassword) {return next(new ErrorHandler("password does not matched", 400));}

  user.password = req.body.newPassword;

  await user.save();

  token(user,200,res)

}

//for get user profile

const getUser=async(req,res,next)=>{

  const user = await User.findById(req.user.id);


  res.status(200).json({
    success:true,
    user,
  });
};


//exports update user profile

const updateUserProfile=async(req,res,next)=>{
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

 
  
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });


};

///delete user profile
const deleteUser= async(req,res,next)=>{
  
const user = await User.findById(req.user.id)

if(!user){
  new ErrorHandler(`No valid user found with ${req.params.id}!`)
}

await user.remove()
res.status(204).send({
  success:true,
  user,
})

}



//Exporting Modules
module.exports={
  createAcc,deleteUser,getUser,login,verify,logout,forgotPassword,resetPassword,updatePassword,updateUserProfile
}