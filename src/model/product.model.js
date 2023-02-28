const mongoose = require("mongoose")
const validator=require("validator")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const productSchema = new mongoose.Schema({
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
 
    validate: [validator.isEmail, "Please Enter a valid Email"],
    trim:true
},
    title: {
        type: String,
        required: [true, "Please Enter product Name"],
        trim: true,
      },
      
      price: {
        type: Number,
        required: [true, "Please Enter product Price"],
        maxLength: [8, "Price cannot exceed 8 characters"],
      },
      description:{
        type:String,
        required:[true,"Please enter the description of your product"]
      } ,  
      
      images: [
        {
          public_id: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
        },
      ],
 
},
{
  timestamps:true,
}
)


module.exports=mongoose.model('Product',productSchema)
