const ErrorHandler = require('../utils/errorHandler')
const Product = require('../model/product.model')
const Pagination = require('../utils/pagination')
const cloudinary = require('cloudinary').v2

//*For creating a new product
const createProduct = async (body, image) => {

  const { name, description, email, title, price, quantity, location } = body

  try {

    const result = await cloudinary.uploader.upload(image.tempFilePath, {
      public_id: `${Date.now()}`,
      resource_type: "auto"
    })



    const product = await Product.create({
      name,
      description,
      price,
      email,
      title,
      image: {
        public_id: result.public_id,
        url: result.secure_url
      },
      quantity, location

    });
    return product
  }
  catch (error) {
    console.log(error)
  }
}

//*For gettting all the product on the dashboard
const getProducts = async (query) => {
  let sorts = 0

  if (query.price === '-1') {
    sorts = -1
  }
  else if (query.price === '1') {
    sorts = 1
  }

  const resultPerPage = 9;
  const pagination = new Pagination(Product.find().sort({ price: sorts }), query).search().sort();

  pagination.pagination(resultPerPage);
  const products = await pagination.query;
  return products

}
//*Total no pages return
const getTotalnoofPages = async () => {
  const value = await Product.find().count() / 9;
  const totalNoPages = Math.ceil(value)

  return totalNoPages

}
//*For updating a product
const updateProducts = async (id, body) => {
  let product = await Product.findById(id);
  if (!product) throw new ErrorHandler("Product not found!", 404)

  product = await Product.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })
  return product
}

//*For deleting
const deleteProducts = async (id) => {
  let product = await Product.findById(id);

  if (!product) throw new ErrorHandler("Product not found", 404)

  product = Product.findByIdAndDelete(id);
  return product;
}



module.exports = { createProduct, getProducts, updateProducts, deleteProducts, getTotalnoofPages }