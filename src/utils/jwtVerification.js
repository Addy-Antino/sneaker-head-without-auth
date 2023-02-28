///Creating auth tok9en and saving it in cookie
const Token = async (user)=>{
    const token =await user.getJWTToken();

    const option ={
        expires: new Date(
            Date.now()+ process.env.COOKIE_EXPIRE*24*60*60*1000
        ),
        httpOnly:true,
    };
    return {user,token,option};
   
};

module.exports = Token;