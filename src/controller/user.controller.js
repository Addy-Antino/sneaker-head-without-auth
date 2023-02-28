const { verify } = require("jsonwebtoken");
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
    Userservice.verify(id,token,res,next)
})



//Login for user

exports.loginforUser=catchAsync(async(req,res,next)=>{
    const { email, password } = req.body;

   const user = Userservice.login(email,password,res,next)
   
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
Userservice.forgotPassword(email,req,res,next)
});

// Reset Password
exports.resetPassword = catchAsync(async (req, res, next) => {
  const password=req.body.password;
  const confirmPassword=req.body.confirmPassword
  const tokens=req.params.token
Userservice.resetPassword(password,confirmPassword,tokens,res,next)
});


//update user Password
exports.updatePassword = catchAsync(async(req,res,next)=>{
  const oldpass= req.body.oldPassword
  const newPass =req.body.newPassword
  const confirmPass=req.body.confirmPassword
  const id = req.user.id
  Userservice.updatePassword(id,oldpass,newPass,confirmPass, res,next)
})

//update user profile
exports.updateProfile =  catchAsync(async(req,res,next)=>{
  const id = req.user.id
  const name =req.body.name
  const email = req.body.email
  Userservice.updateUserProfile(id,name,email,res,next)
})

//for get user profile

exports.getUserProfile = catchAsync(async(req,res,next)=>{
  const id = req.user.id
  Userservice.getUser(id,res,next)

});







//delete user profile

exports.deleteUserProfile= catchAsync(async(req,res,next)=>{
  const id = req.user.id
  Userservice.deleteUser(id,res,next)

})