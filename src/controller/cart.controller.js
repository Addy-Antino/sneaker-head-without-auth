const catchAsync = require("../middleware/catchAsync");
const Cart = require("../service/cart.service");
const ErrorHandler = require("../utils/errorHandler")

//*create cart
exports.cartadd = catchAsync(async (req, res, next) => {
  const { name, price, quantity, description, product_id, whats_for, image, email } = req.body

  if (!name || !price || !quantity || !description || !product_id || !whats_for) {
    throw new ErrorHandler("Please fill the required fields")
  }

  const cart = await Cart.createCart(name, price, quantity, description, product_id, whats_for, image, email)
  res.status(201).json({
    success: true,
    cart
  })
})

//*view cart
exports.cartview = catchAsync(async (req, res, next) => {

  const cart = await Cart.getCart()
  res.status(200).json({
    success: true,
    cart
  })
})
//*Delete cart

exports.cartdel = catchAsync(async (req, res, next) => {
  const product_id = req.body.product_id
  const cart = await Cart.cartDel(product_id)
  res.status(204).json({
    success: true,
    cart
  })
})

//*Delete all carts

exports.cartDelAll = catchAsync(async (req, res, next) => {

  const deleteCart = await Cart.cartDelAll()
  res.status(204).json({
    success: true,
    deleteCart
  })
})