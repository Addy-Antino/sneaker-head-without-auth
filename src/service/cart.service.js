const Cart = require('../model/cart.model')
const ErrorHandler = require('../utils/errorHandler')

//*This is method is for create cart
const createCart = async (name, price, quantity, description, product_id, whats_for, image, email) => {
  const cart = await Cart.create({
    name, price, quantity, description, description, product_id, whats_for, image, email
  })
  return cart
}

//*get cart
const getCart = async () => {

  const cart = await Cart.find()
  return cart
}
//*Cart delete
const cartDel = async (product_id) => {
  const cart = await Cart.findOneAndDelete(product_id)
  return cart
}
//* Cart deleteAll 
const cartDelAll = async (user) => {

  const cart = await Cart.deleteMany()
  return cart
}

module.exports = { createCart, getCart, cartDel, cartDelAll }