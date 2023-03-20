const ErrorHandler = require('../utils/errorHandler')
const Order = require("../model/ordermodel")
const Product = require("../model/product.model");
const sendMail = require('../utils/sendMail')


//*create order service 
const CreateOrder = async (address,
  city,
  state,
  country,
  pinCode,
  phoneNo,
  card_no,
  product_id
) => {

  const order = await Order.create({
    address,
    city,
    state,
    country,
    pinCode,
    phoneNo,
    card_no,
    product_id
  });
  const product = await Product.findById(product_id)
  const email = product.email;
  const productname = product.title;
  const message = `A user created a order for your product: ${productname}.Here is the information who have created the order.The following is the address :  ${address}, ${city}, ${state}, ${country}, ${pinCode}.Here is the contact details : ${phoneNo}.
Please try to dispatch the order as soon as possible`;
  try {


    await sendMail({
      email: email,
      subject: `Snicker Head Order Created`,
      message,
    });




  } catch (error) {

    console.log(error)
  }
  return order

}


//*view order service 

const getOrder = async () => {

  const order = await Order.find()
  return order

}

//*cancel order 

const cancelOrder = async (id) => {

  const order = await Order.findById(id);
  if (!order) throw new ErrorHandler("Order not found!", 404)






  const neworder = await Order.findByIdAndDelete(id)
  return neworder
}





module.exports = { CreateOrder, getOrder, cancelOrder }