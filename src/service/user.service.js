const User = require("../model/user.model")
const Token= require("../model/userver.model")
const sendMail=require('../utils/sendMail')
const crypto =require('crypto')
const token=require("../utils/jwtVerification")
const tokenService = require('./token.service')
const ErrorHandler = require('../utils/errorHandler')
const { threadId } = require("worker_threads")

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
const verify=async(id,token,res,next)=>{
    // try {
        const user = await User.findOne({ _id: id });
        
        if (!user)  return next(new ErrorHandler("Invalid Link", 400));
    
        const tokens = await Token.findOne({
          userId: id,
          token: token,
        });
        if (!tokens) return next(new ErrorHandler("Invalid Link", 400));
       
     
    
        await User.findByIdAndUpdate( id, {is_verified: true });
        await Token.findByIdAndRemove(tokens._id);
        
       return  res.status(200).json({
          success:true,
          verified:true,
          message:'Email successfully verified'
        })
    
}

//Login for user

const login=async(email,password,res,next)=>{
    
  if (!email || !password) return next(new ErrorHandler("Please Enter Email & Password", 400));

  const user = await User.findOne({ email }).select("+password");
  
  if (!user) return next(new ErrorHandler("Invalid Email or Password", 400));

  if(user.is_verified ===false){
    return next(new ErrorHandler("Pending Account. Please Verify Your Email!",401))
  }



  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) return next(new ErrorHandler("Invalid Email or Password", 400));

    token(user,200,res)
  };

//Logout user

const logout =async ( res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

 
};
    
// Forgot Password
const forgotPassword = async (email, req,res, next) => {
  const user = await User.findOne({ email: email });

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
const resetPassword = async (password,confirmPassword,tokens, res, next) => {
 
  const resetPasswordToken = crypto
  .createHash("sha256")
  .update(tokens)
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

if (password !== confirmPassword) {
  return next(new ErrorHandler("Password does not matched", 400));
}

user.password =password;
user.resetPasswordToken = undefined;
user.resetPasswordExpire = undefined;

await user.save();

token(user, 200, res);
};

//Update user password

const updatePassword = async(id,oldpass,newPass,confirmPass, res,next)=>{
  const user =  await User.findById(id).select('+password')
 
  const ifPasswordMatched = await user.comparePassword(oldpass)
 
  if(!ifPasswordMatched) {return next(new ErrorHandler("Old password is incorrect", 400));}

  if (newPass !==confirmPass) {return next(new ErrorHandler("password does not matched", 400));}

  user.password = newPass;

  await user.save();

  token(user,200,res)

}

//for get user profile

const getUser=async(id,res,next)=>{

  const user = await User.findById(id);


  res.status(200).json({
    success:true,
    user,
  });
};


//exports update user profile

const updateUserProfile=async(id,name,email,res,next)=>{

  const newUserData = {
    name: name,
    email:email,
  };

try{
  
  const user = await User.findByIdAndUpdate(id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  token(user,200,res)
}
catch(error){
  return res.status(400).json({
    success:false,
    message:'email already exists'
  })
}
}
///delete user profile
const deleteUser= async(id,res,next)=>{
  
const user = await User.findById(id)

if(!user){
  new ErrorHandler(`No valid user found with ${id}!`)
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