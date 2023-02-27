const mongoose = require("mongoose")
const validator=require("validator")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const productSchema = new mongoose.Schema({
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
      color:{
        type:String,
        required:[true,"Please enter the color of your product"]
      } ,  
      size:{
        type:Number,
        required:[true,"Please enter the product size"]
      },
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
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
},
{
  timestamps:true,
}
)


module.exports=mongoose.model('Product',productSchema)
