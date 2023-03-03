const ErrorHandler = require('../utils/errorHandler')
const Product =  require('../model/product.model')
const Pagination = require('../utils/pagination')


//*For creating a new product
const createProduct=async(body,id)=>{
  body.user=id
  const product =await Product.create(body);
    return product
  
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