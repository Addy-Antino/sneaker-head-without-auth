const express= require('express');
const { getProducts } = require('../service/product.service');

const router = express.Router();
router.route('/products').get(getProducts)

module.exports=router