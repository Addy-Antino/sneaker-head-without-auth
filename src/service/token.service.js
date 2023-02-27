const Token = require('../model/userver.model');
const crypto = require('crypto')
const generateErificationToken = async (userId)=>{
    const newtoken = crypto.randomBytes(32).toString("hex");
    const data = new Token({
        userId,
        token: newtoken,
    })
    return await data.save();

    
}
module.exports= {
    generateErificationToken
}