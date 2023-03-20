const express = require('express');
const { ifAuthenticateduser } = require('../middleware/auth');
const { newOrder, getOrders, cancelOrder } = require('../controller/order.controller')

const router = express.Router();

//new Order
router.route('/order/new').post(newOrder)
router.route('/orders').get(getOrders)
router.route('/cancel/order/:id').delete(cancelOrder)


module.exports = router