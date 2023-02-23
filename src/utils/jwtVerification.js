///Creating auth tok9en and saving it in cookie

const Token = (user,statusCode,res)=>{
    const token =user.getJWTToken();

    const option ={
        expires: new Date(
            Date.now()+ process.env.COOKIE_EXPIRE*24*60*60*1000
        ),
        httpOnly:true,
    };
    res.status(statusCode).cookie("token",token,option).json({
        success:true,
        user,
        token
    });
};

module.exports = Token;