const express= require('express');
const { ifAuthenticateduser } = require('../middleware/auth');
const { getProducts, updateProduct, createProduct, deleteProduct } = require('../controller/product.controller');

const router = express.Router();

router.route('/new/product').post(ifAuthenticateduser,createProduct)
router.route('/products').get(getProducts)
// router.route('/updateProduct').put(updateProduct)
// router.route('/deleteProduct').delete(deleteProduct)

module.exports=router