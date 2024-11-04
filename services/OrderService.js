const { mongoose } = require("mongoose");
const Order = require("../models/Order");
const { retrieveStripeCustomer } = require("./PaymentService");
const { viewCart, removeCustomerShoppingCart } = require("./ShoppingCartService");
const Payment = require("../models/Payment");

const createOrderService = async (stripePaymentObj, paymentReferenceId) => {
  try {
    const stripeCustomerId = stripePaymentObj.customer;
    const stripeCustomer = await retrieveStripeCustomer(stripeCustomerId);
    const mongoCustomerId = new mongoose.Types.ObjectId(
        stripeCustomer.metadata.customerId
      );

      const customerShoppingCart = await viewCart(mongoCustomerId);
      console.log("customerShoppingCart", customerShoppingCart)

    const order = new Order({
      customerId: mongoCustomerId,
      products: customerShoppingCart.items,
      paymentReference: paymentReferenceId,
      orderStatus: "active"
    }).save();
    const isCartRemoved = await removeCustomerShoppingCart(mongoCustomerId);
    if(isCartRemoved){
        console.log("cart is removed");
    }
    return order;

  } catch (error) {
    throw new Error(`error creating oder: ${error}`);
  }
};

const fetchOrderByIdService = async(orderId)=>{
try {
  const orderIdMongo = new mongoose.Types.ObjectId(orderId);
  const order = await Order.findById(orderIdMongo).populate("products.product paymentReference");

  return order;
  return
} catch (error) {
  console.error(`error fetching order by id: ${error.message}`);
  throw new Error(`error fetching order by id: ${error}`);
}
}

const fetchOrdersService = async(customerId)=>{
  try {
    const customerIdMongo = new mongoose.Types.ObjectId(customerId);
    const orders = await Order.find({customerId: customerIdMongo}).populate("products.product paymentReference");
    return orders;
    
  } catch (error) {
    console.error(`error fetching orders: ${error.message}`);
    throw new Error(`error fetching orders: ${error}`);
  }
  }

  const fetchOrderIdByStripePaymentIntentService = async(paymentIntentId)=>{
    try {
      const payment = await Payment.find({paymentReference: paymentIntentId});
      console.log("payment", payment);
      if(payment){
        const order = await Order.find({paymentReference:payment[0]._id}).populate("products.product paymentReference");
        console.log("order", order);
        return order[0]._id;
      }
    } catch (error) {
      throw new Error(`error fetching orders by stripe payment intent: ${error}`);
    }
  }

module.exports = { createOrderService, fetchOrdersService, fetchOrderByIdService, fetchOrderIdByStripePaymentIntentService };
