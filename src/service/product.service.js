const ErrorHandler = require('../utils/errorHandler')
const catchAsync = require('../middleware/catchAsync')
const Product =  require('../model/product.model')
const user = require('../model/user.model')
const cloudinary =  require('cloudinary')


const createProduct=async(body,res)=>{
    
  const product =await Product.create(body);
  res.status(201).json({
    success:true,
    product
   })
  
}




exports.getProducts=(req,res)=>{


    res.status(200).json({message:"Route is working"})
}


exports.updateProduct=(req,res)=>{

}

exports.deleteProduct=(req,res)=>{
    
}



module.exports={createProduct}