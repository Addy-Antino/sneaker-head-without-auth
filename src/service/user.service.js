const User = require("../model/user.model")
const Token = require("../model/userver.model")
const sendMail = require('../utils/sendMail')
const crypto = require('crypto')
const tokenUtils = require("../utils/jwtVerification")
const tokenService = require('./token.service')
const ErrorHandler = require('../utils/errorHandler')
const logger = require("../utils/logger")

///for create account
const createAcc = async (name, email, password) => {



  //saving the data to the database
  const user = await User.create({
    name, email, password
  })
  logger.log('info', "User created waiting for email verification")
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
    logger.log('error', "Error occured while creating user")
    console.log(error)
  }

}

//For verify account
const verify = async (id, token) => {
  // try {
  const user = await User.findOne({ _id: id });

  if (!user) throw new ErrorHandler("Invalid Link", 404)

  const tokens = await Token.findOne({
    userId: id,
    token: token,
  });
  if (!tokens) throw new ErrorHandler("Invalid Link", 404)



  await User.findByIdAndUpdate(id, { is_verified: true });
  logger.log('info', "User  mail successfully verified")
  await Token.findByIdAndRemove(tokens._id);

  return true;
}

//Login for user

const login = async (email, password) => {

  if (!email || !password) throw new ErrorHandler("Please Enter Email & Password", 404);

  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new ErrorHandler("Invalid Email or Password", 401);

  if (user.is_verified === false) {
    logger.log('error', "Pending verifiction")
    throw new ErrorHandler("Pending Account. Please Verify Your Email!", 401)

  }



  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) throw new ErrorHandler("Invalid Email or Password", 401);
  const { token, option } = await tokenUtils(user)
  logger.log('info', "successful login")
  return { user, token, option };
};

//Logout user

const logout = async (res) => {
  logger.log('info', "successful logout")
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });


};

// Forgot Password
const forgotPassword = async (email, host, protocol) => {
  const user = await User.findOne({ email: email });

  if (!user) { throw new ErrorHandler("User not found", 404) }


  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `http://localhost:3000/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendMail({
      email: user.email,
      subject: `Sneaker Heads Password Recovery`,
      message,
    });
    logger.log('info', "password reset token send to user")
    return true;

  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    logger.log('error', "password reset token not send")
    await user.save({ validateBeforeSave: false });

    throw new ErrorHandler(error.message, 500)
  }
};

// Reset Password
const resetPassword = async (password, confirmPassword, tokens) => {

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(tokens)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    logger.log('error', "password reset token invalid or expired")
    throw new ErrorHandler("Reset password token is invaild or expired", 400)
  }


  if (password !== confirmPassword) {
    throw new ErrorHandler("Password does not matched", 400)
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  logger.log('info', "Password changed!")
  await user.save();

}



//Update user password

const updatePassword = async (id, oldpass, newPass, confirmPass) => {
  const user = await User.findById(id).select('+password')

  const ifPasswordMatched = await user.comparePassword(oldpass)

  if (!ifPasswordMatched) throw new ErrorHandler("Old password is incorrect", 400);

  if (newPass !== confirmPass) throw new ErrorHandler("password does not matched", 400);

  user.password = newPass;

  await user.save();

  const { token, option } = await tokenUtils(user)
  logger.log('info', "Password updated")
  return { user, token, option };
};


//for get user profile

const getUser = async (id) => {

  const user = await User.findById(id);
  return user;

};


//exports update user profile

const updateUserProfile = async (id, name, email) => {

  const newUserData = {
    name: name,
    email: email,
  };

  try {

    const user = await User.findByIdAndUpdate(id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    const { token, option } = await tokenUtils(user)
    return { user, token, option };

  }
  catch (error) {
    throw new ErrorHandler("Email already exists", 400)
  }
}

///delete user profile
const deleteUser = async (id) => {

  const user = await User.findById(id)

  if (!user) {
    new ErrorHandler(`No valid user found with ${id}!`)
  }
  logger.log('info', "User deleted")
  await user.remove()
  return user
}




//Exporting Modules
module.exports = {
  createAcc, deleteUser, getUser, login, verify, logout, forgotPassword, resetPassword, updatePassword, updateUserProfile
}