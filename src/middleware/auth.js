const { toNamespacedPath } = require("path");
const catchAsync = require("./catchAsync");

exports.ifAuthenticateduser = catchAsync(async(req,res,next)=>{
    const token = req.cookie;

    console.log(token)
})