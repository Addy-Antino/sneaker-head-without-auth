const express = require('express')
const { ifAuthenticateduser } = require('../middleware/auth')
const { cartadd, cartview, cartdel, cartDelAll } = require("../controller/cart.controller")

const router = express.Router()
//route for raising help
router.route('/cart').post(cartadd)
router.route('/carts').get(cartview)
router.route('/cart/r').delete(cartdel)
//* Route for remove all items from cart
router.route('/cart/all').delete(cartDelAll)

module.exports = router