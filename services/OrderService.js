const { mongoose } = require("mongoose");
const Order = require("../models/Order");
const { retrieveStripeCustomer } = require("./PaymentService");
const { viewCart, removeCustomerShoppingCart } = require("./ShoppingCartService");

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

module.exports = { createOrderService };
