const mongoose = require("mongoose")
const validator=require("validator")

const helpSchema = new mongoose.Schema({
name:{
    type:String,
    required:[true,"Please enter your name!"],

    maxLength:[30,"Name cannot exceed 30 character"],
    minLength:[4,"Name should be at least 4 characters "],
    trim:true
},
email:{
    type:String,
    required:[true,"Please enter your email"],
    validate:[validator.isEmail,"Please enter a valid email"],
    trim:true
},
subject:{
    type:String,
    required:[true,"Please enter the subject"],
    trim:true
},
message:{
    type:String,
    required:[true,"Please enter your message"],
    trim:true

},


},{
    timestamps:true
})
module.exports=mongoose.model("Help",helpSchema)