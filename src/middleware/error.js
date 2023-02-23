const ErrorHandler = require("../utils/errorHandler")

module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500
    err.message = err.message || "Internal server error!"

//Wrong ID error --MONGODB
if(err.name ==="CastError"){
    const message=`Resource not found! Invalid: ${err.path}`
    err=new ErrorHandler(message,400)
}


  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `${Object.keys(err.keyValue)} already registered`;
    err = new ErrorHandler(message, 409);
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Login invalid please login again! `;
    err = new ErrorHandler(message, 400);
  }

  // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    const message = `Login expired, Please log in again `;
    err = new ErrorHandler(message, 400);
  }



res.status(err.statusCode).json({
    success:false,
    error:err.message,
});
}