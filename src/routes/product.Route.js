const express= require('express');
const { getProducts, updateProduct, createProduct, deleteProduct } = require('../service/product.service');

const router = express.Router();

router.route('/new/product').post(createProduct)
router.route('/products').get(getProducts)
router.route('/updateProduct').put(updateProduct)
router.route('/deleteProduct').delete(deleteProduct)

module.exports=router