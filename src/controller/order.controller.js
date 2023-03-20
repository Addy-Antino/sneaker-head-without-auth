const ErrorHandler = require("../utils/errorHandler")
const catchAsync = require("../middleware/catchAsync");
const { CreateOrder, getOrder, cancelOrder } = require("../service/order.service");

//create new order
exports.newOrder = catchAsync(async (req, res, next) => {
  const {
    address,
    city,
    state,
    country,
    pinCode,
    phoneNo,
    card_no,
    product_id


  } = req.body;

  const order = await CreateOrder(
    address,
    city,
    state,
    country,
    pinCode,
    phoneNo,
    card_no,
    product_id

  );

  res.status(201).json({
    success: true,
    order,
  });

})

//get new orders 

exports.getOrders = catchAsync(async (req, res, next) => {

  const order = await getOrder()
  res.status(200).json({
    success: true,
    order
  })
})

//cancel order


exports.cancelOrder = catchAsync(async (req, res, next) => {

  const id = req.params.id
  const cOrder = await cancelOrder(id)
  res.status(204).json({
    success: true,
    cOrder
  })

})