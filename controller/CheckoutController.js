const stripe = require("stripe")(
  "sk_test_51LQdcMIBU3FsdwlicaqPCz4n3W3gxTbi7PojiQvaG1rAAY9LG5W9f7dmS3nxcvu2uGJpapBNedwel8gK7E1vycrK00R8PeQ7AL"
);

const endpointSecret = "whsec_8333b7d1983014deff8d5a47e1a39b9c19c9425ec050afdd7924709a334c0b37";
const { mongoose } = require("mongoose");
const ShoppingCart = require("../models/ShoppingCart");
const { findCustomerByIdService } = require("../services/UserService");
const { saveStripePayment } = require("../services/PaymentService");
const { createOrderService } = require("../services/OrderService");

const calculateOrderAmount = async (req) => {
  try {
    const customerId = new mongoose.Types.ObjectId(req.body.customerId);
    console.log("req.body", req.body);
    const customerShoppingCart = await ShoppingCart.findOne({
      customerId: customerId,
    }).populate("items.product");
    if (!customerShoppingCart) {
      throw new Error(`no customer found with id: ${customerId}`);
    }
    console.log("customer cart: ", customerShoppingCart);
    let totalPrice = 0.0;

    customerShoppingCart.items.forEach((item) => {
      totalPrice += item.product.price * item.quantity;
    });
    console.log("total price", totalPrice);
    // since stripe assumes payments are in cents to get the right amount of money multiply by 100
    return parseFloat(totalPrice) * 100;
  } catch (error) {
    console.error("error caluclating order amount: ", error.message);
  }
};


const createPaymentIntent = async (req, res) => {
  try {
    const customerData = await findCustomerByIdService(req.body.customerId);

    const amount = await calculateOrderAmount(req);

    // create a customer obj with stripe inorder to associate future payments
    const customer = await stripe.customers.create({
      name: customerData.firstName +" "+ customerData.lastName,
      email: customerData.email,
      metadata: {
        username: customerData.username,
        customerId: customerData._id.toString(),
        test: "test"
      }
    });
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      customer: customer.id || null,
      
     
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
      payment_intent_data: {

      },
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("error creating checkout session", error.message);
  }
};

const stripeWebhookListener = async(req, res) => {
  try {
    const sig = req.headers["stripe-signature"];
    let event;

    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        // console.log("payment_intent.succeeded", paymentIntentSucceeded);
        
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      case "charge.succeeded":
        const chargeSucceeded = event.data.object;
        const stripePaymentSave = await saveStripePayment(chargeSucceeded);
        if(stripePaymentSave){
         const order = await createOrderService(chargeSucceeded, stripePaymentSave._id);
        }
        console.log("charge.succeeded", stripePaymentSave);
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return res.send();

  } catch (error) {
    console.error("webhook error: ", error.message);
    return res.status(500).send(`Webhook Error: ${error.message}`);
    
  }
};

module.exports = {
  createPaymentIntent,
  stripeWebhookListener,
};
