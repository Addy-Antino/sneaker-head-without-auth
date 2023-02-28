const catchAsync = require("../middleware/catchAsync")
const Userservice =  require("../service/user.service")
const ErrorHandler=require("../utils/errorHandler")


///for create account

exports.createAccount=catchAsync(async(req,res,next)=>{
  const {name , email , password} = req.body;
   ///Checking if any fields are empty
  if(!name || !email || !password){
   throw new Error("Please enter the required fields",404)
    }
  const user = await  Userservice.createAcc(name,email,password);
  if(!user){
    throw new Error('something went wrong while creating user');
  }
  return res.status(201).json({
    message:'user created successfully',
    error:false,
    data:user
  })
})
 
//For verify account
exports.verifyacc=catchAsync(async(req,res,next)=>{
    const id = req.params.id
    const token = req.params.token
  const data = await  Userservice.verify(id,token);
  if(!data) throw new Error('verification failed')
    res.status(200).json({
      success:true,
      verified:true,
      message:'Email successfully verified'
    })

})



//Login for user

exports.loginforUser=catchAsync(async(req,res,next)=>{
    const { email, password } = req.body;

   const user =await Userservice.login(email,password);
   res.status(200).cookie("token",user.token,user.option).json({
    success:true,
    user,
  
});
   
 });

//Logout user

exports.logoutforuser = catchAsync(async (req, res, next) => {
  Userservice.logout(res)
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});
    

// Forgot Password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const email = req.body.email
  const host= req.get(
    "host"
  )
 const protocol = req.protocol 
await Userservice.forgotPassword(email,host,protocol)
res.status(200).json({
  success: true,
  message: `Email sent to ${email} successfully`,
});
});

// Reset Password
exports.resetPassword = catchAsync(async (req, res, next) => {
  const password=req.body.password;
  const confirmPassword=req.body.confirmPassword
  const tokens=req.params.token
const user = await Userservice.resetPassword(password,confirmPassword,tokens)
res.status(200).json({
  success:true,
  user,
});
});


//update user Password
exports.updatePassword = catchAsync(async(req,res,next)=>{
  const oldpass= req.body.oldPassword
  const newPass =req.body.newPassword
  const confirmPass=req.body.confirmPassword
  const id = req.user.id
  const user =await Userservice.updatePassword(id,oldpass,newPass,confirmPass)
    res.status(200).cookie("token",user.token,user.option).json({
    success:true,
    user,
  
})
})

//update user profile
exports.updateProfile =  catchAsync(async(req,res,next)=>{
  const id = req.user.id
  const name =req.body.name
  const email = req.body.email
  const user = await Userservice.updateUserProfile(id,name,email)
  res.status(200).cookie("token",user.token,user.option).json({
    success:true,
    user,
  
})
})
//for get user profile

exports.getUserProfile = catchAsync(async(req,res,next)=>{
  const id = req.user.id
  const user = await Userservice.getUser(id)
  res.status(200).json({
    success:true,
    user,
  });
});




//delete user profile

exports.deleteUserProfile= catchAsync(async(req,res,next)=>{
  const id = req.user.id
  const user = await Userservice.deleteUser(id)
  Userservice.logout(res)
  res.status(204).json({
    success:true,
    user,
  })
 

})

