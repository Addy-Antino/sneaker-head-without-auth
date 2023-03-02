const express= require('express');
const { ifAuthenticateduser } = require('../middleware/auth');
const { newOrder,getOrders,cancelOrder } = require ('../controller/order.controller')

const router = express.Router();

//new Order
router.route('/order/new').post(ifAuthenticateduser,newOrder)
router.route('/orders').get(ifAuthenticateduser,getOrders)
router.route('/cancel/order/:id').delete(ifAuthenticateduser,cancelOrder)


module.exports=router