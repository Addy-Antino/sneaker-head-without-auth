const mongoose =  require('mongoose')

 const cartSchema =  new mongoose.Schema({
    product_id:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    whats_for:{
        type:String,
        required:true
    },
    user:{
        type:String,
        required:true
        
    },
   description:{
    type:String,
    required:true
   }
 })

 module.exports = mongoose.model("Cart",cartSchema)