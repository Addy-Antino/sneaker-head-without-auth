const ErrorHandler = require('../utils/errorHandler')
const Product =  require('../model/product.model')
const Pagination = require('../utils/pagination')
const cloudinary = require('cloudinary').v2

//*For creating a new product
const createProduct=async(body,id,image)=>{

  const{name,description,email,title,price,quantity}=body
  
  try{
   
    const result =  await cloudinary.uploader.upload(image.tempFilePath, {
      public_id: `${Date.now()}`, 
      resource_type: "auto"
  })
  
  
  const user = id
  const product =await Product.create({
    name,
    description,
    price,
    email,
    title,
    image:{
      public_id:result.public_id,
      url:result.secure_url
    },
    quantity,user
    
  });
    return product
  }
  catch(error){
    console.log(error)
  }
}

//*For gettting all the product on the dashboard
const getProducts=async(query)=>{
  const pagination = new Pagination(Product.find(),query).search();
  const products =await pagination.query;
  return products
    
}

//*For updating a product
const updateProducts=async(id,body)=>{
let product = await Product.findById(id);
if(!product) throw new ErrorHandler("Product not found!",404)

product =  await Product.findByIdAndUpdate(id,body,{
  new:true,
  runValidators:true,
  useFindAndModify:false
})
 return product
}

//*For deleting
const deleteProducts=async(id)=>{
  let product = await  Product.findById(id);
  
  if(!product) throw new ErrorHandler("Product not found",404)

  product =Product.findByIdAndDelete(id);
  return product;
}



module.exports={createProduct,getProducts,updateProducts,deleteProducts}