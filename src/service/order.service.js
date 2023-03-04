const ErrorHandler = require('../utils/errorHandler')
const   Order =  require("../model/ordermodel")
const Product = require("../model/product.model");
const { findById } = require('../model/ordermodel');

//*create order service 
const CreateOrder = async(shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,user)=>{

await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: user,
  });


}
 

//*view order service 

const getOrder =  async(id) =>{
  const query ={ user:id}
  const order = await Order.find(query)
  return order
  
}

//*cancel order 

const cancelOrder  = async(user,id)=>{

const order=await Order.findById(id);
if(!order) throw new ErrorHandler("Order not found!",404)




if(order.user != user){
  throw new ErrorHandler("You are not allowed to cancel this order",401)
}

order = await Order.findByIdAndDelete(id)
return order
}





module.exports =  { CreateOrder,getOrder,cancelOrder}