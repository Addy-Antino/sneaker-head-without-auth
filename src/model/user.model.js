const mongoose = require("mongoose")
const validator=require("validator")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    name:{
            type : String,
            required:[true,"Please enter your name!"],
            maxLength: [30, "Name cannot exceed 30 characters"],
            minLength: [4, "Name should have more than 4 characters"],
            trim:true
    },
    email:{
            type:String,
            required:[true,"please enter your email"],
            unique: true,
            validate: [validator.isEmail, "Please Enter a valid Email"],
            trim:true
    },
    password:{
        type: String,
        required: [true, "Please Enter Your Password"],
        trim:true,
        minLength: [8,"Password should be greater than 8 characters"],
        select:false,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('password length should be greater than 6 and doesnot contain (password )')
    }
}



    },
    is_verified:{
        type:Boolean,
        default:false
    },
    
    resetPasswordUrl:String,
    resetPasswordExpire:Date,
},

{
    timestamps:true
}

)


/////Here we are hasing our passwords with 12 iterations so it will be tougher to hack!!
userSchema.pre("save",async function(next){



    if(!this.isModified("password")){
        next();
    }
    this.password=await bcryptjs.hash(this.password,12)
})

//Here we are using jwt token for the cookies
userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    })
}
//compare Password
userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcryptjs.compare(enteredPassword,this.password);
}






module.exports=mongoose.model('User',userSchema)
