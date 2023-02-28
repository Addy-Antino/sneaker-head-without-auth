const ErrorHandler = require('../utils/errorHandler')
const catchAsync = require('../middleware/catchAsync')
const Productservice =  require('../service/product.service')


//For creating a product
exports.createProduct=catchAsync(async(req,res,next)=>{

    const { name ,email,title , description,price,images} =req.body
    if(!name||!email||!title||!description||!price||!images){
        return next(new ErrorHandler('Please fill up the required fields',400))
    }

const body =req.body
Productservice.createProduct(body,res)
   
})




//For get all products 
exports.getProducts=catchAsync(async(req,res)=>{


  
})

//For updating products
exports.updateProduct=catchAsync(async(req,res)=>{

})


//For delete a particular product
exports.deleteProduct=catchAsync(async(req,res)=>{
    
})



