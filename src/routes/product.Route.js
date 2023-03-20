const express = require('express');
const { ifAuthenticateduser } = require('../middleware/auth');
const { getProducts, updateProduct, createProduct, deleteProduct, getTotalnopages } = require('../controller/product.controller');

const router = express.Router();
//for creating a new product
router.route('/new/product').post(createProduct)
//for showing the products on the dashboard
router.route('/products').get(getProducts)
//* for giving total no of pages
router.route('/products/pages').get(getTotalnopages)
//for updating a product with its product id
router.route('/update/product/:id').put(ifAuthenticateduser, updateProduct)
//for deleting a product with its id
router.route('/delete/product/:id').delete(ifAuthenticateduser, deleteProduct)

module.exports = router