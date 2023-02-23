const mongoose = require("mongoose")
const validator=require("validator")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter product Name"],
        trim: true,
      },
      description: {
        type: String,
        required: [true, "Please Enter product Description"],
      },
      price: {
        type: Number,
        required: [true, "Please Enter product Price"],
        maxLength: [8, "Price cannot exceed 8 characters"],
      },   

})





module.exports=mongoose.model('User',productSchema)
