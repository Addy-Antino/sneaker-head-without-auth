const Cart = require('../model/cart.model')
// const ErrorHandler = require('../utils/errorHandler')

//*This is method is for create cart
const createCart = async(name,price,quantity,description,product_id,whats_for,user)=>{
    const cart = await Cart.create({
        name,price,quantity,description,description,product_id,whats_for,user
    })
    return cart
}

//*get cart
const getCart = async(id)=>{
    const query ={ user:id}
    const cart = await Cart.find(query)
    return cart
}



module.exports = {createCart,getCart}