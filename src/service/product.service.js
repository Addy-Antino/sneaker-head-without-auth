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

const getProducts=async(req,res)=>{
  const products =await Product.find();
res.status(200).json({
  success:true,
  products
})

    
}


exports.updateProduct=(req,res)=>{

}

exports.deleteProduct=(req,res)=>{
    
}



module.exports={createProduct,getProducts}