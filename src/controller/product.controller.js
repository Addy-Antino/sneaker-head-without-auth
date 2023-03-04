const ErrorHandler = require('../utils/errorHandler')
const catchAsync = require('../middleware/catchAsync')
const Productservice =  require('../service/product.service')


//For creating a product
exports.createProduct=catchAsync(async(req,res,next)=>{

    const { name ,email,title , description,price,quantity} =req.body
    if(!name||!email||!title||!description||!price||!quantity){
        return next(new ErrorHandler('Please fill up the required fields',400))

    }

    const body =req.body
    const id =req.user.id
    const image = req.files.image
    
    const product = await Productservice.createProduct(body,id,image)
    res.status(201).json({
        success:true,
        product
    })
})

//For get all products 
exports.getProducts=catchAsync(async(req,res)=>{
const query = req.query
 const products =await Productservice.getProducts(query);
    res.status(200).json({
        success:true,
        products
      })
  
})

//For updating products
exports.updateProduct=catchAsync(async(req,res)=>{
    const id  =  req.params.id
    const body = req.body
    const product = await Productservice.updateProducts(id,body);
    res.status(200).json({
        success:true,
        product
    })
})


//For delete a particular product
exports.deleteProduct=catchAsync(async(req,res)=>{
    const id = req.params.id
     await Productservice.deleteProducts(id)

    res.status(204).json({
        success:true,
        meassage:"Product deleted successfully",
        
    })
})



