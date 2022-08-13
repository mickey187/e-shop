const stripe = require('stripe')('sk_test_51LQdcMIBU3FsdwlicaqPCz4n3W3gxTbi7PojiQvaG1rAAY9LG5W9f7dmS3nxcvu2uGJpapBNedwel8gK7E1vycrK00R8PeQ7AL');
const endpointSecret = "whsec_No9XV579f1GkjjgDq2VlQLBf82mOyGAb";
// const { placeOrderStripe } = require('../controller/OrderApiController');
const {OrderApiController, placeOrderStripe} = require('../controller/OrderApiController');
const { findOne } = require('../models/Order');
const ShoppingCart = require('../models/ShoppingCart');

exports.createPaymentIntent = async(req, res)=>{
    
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 250000,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });
    
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
}

exports.listenStripeEvents = async(request, response)=>{
    // console.log(request.rawBody);
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    // console.log("it worked");
  } catch (err) {
    // console.log("yooooooooooooooo" + err.message);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'charge.captured':
      const charge_captured = event.data.object;
      // Then define and call a function to handle the event charge.captured
      break;
    case 'charge.expired':
      const charge_expired = event.data.object;
      // Then define and call a function to handle the event charge.expired
      break;
    case 'charge.failed':
      const charge_failed = event.data.object;
      // Then define and call a function to handle the event charge.failed
      break;
    case 'charge.pending':
      const charge_pending = event.data.object;
      // Then define and call a function to handle the event charge.pending
      break;
    case 'charge.refunded':
      const charge_refunded = event.data.object;
      // Then define and call a function to handle the event charge.refunded
      break;
    case 'charge.succeeded':
      const charge_succeeded = event.data.object;
      // console.log("yaaaaaaaaaaaay it charged fuck yeah", charge_succeeded.id);
      var status = await placeOrderStripe(charge_succeeded);
      // console.log("from charge succeeded "+status);
      
      // Then define and call a function to handle the event charge.succeeded
      break;
    case 'charge.updated':
      const charge_updated = event.data.object;
      // Then define and call a function to handle the event charge.updated
      break;
    case 'charge.dispute.closed':
      const charge_dispute_closed = event.data.object;
      // Then define and call a function to handle the event charge.dispute.closed
      break;
    case 'charge.dispute.created':
      const chargedispute_created = event.data.object;
      // Then define and call a function to handle the event charge.dispute.created
      break;
    case 'charge.dispute.funds_reinstated':
      const charge_dispute_funds_reinstated = event.data.object;
      // Then define and call a function to handle the event charge.dispute.funds_reinstated
      break;
    case 'charge.dispute.funds_withdrawn':
      const charge_dispute_funds_withdrawn = event.data.object;
      // Then define and call a function to handle the event charge.dispute.funds_withdrawn
      break;
    case 'charge.dispute.updated':
      const charge_dispute_updated = event.data.object;
      // Then define and call a function to handle the event charge.dispute.updated
      break;
    case 'charge.refund.updated':
      const charge_refund_updated = event.data.object;
      // Then define and call a function to handle the event charge.refund.updated
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
  
}


// ab code

exports.StripePayEndpointIntentId = async (req, res)=>{
  const {paymentIntentId} = req.body;
  try {
      if (paymentIntentId) {
          const intent = await stripe.paymentIntents.confirm(paymentIntentId);
          return res.send(generateResponse(intent)); 
      }
      return res.sendStatus(400);
  } catch (e) {
      return res.send({ error: e.message });
  }

}

exports.StripePayEndpointMethod = async (req, res)=>{
  const {paymentMethodId, items, currency, useStripeSdk, } = req.body;
  const orderAmount = calculateOrderAmount(items);
  try {
      if (paymentMethodId) {
          const params = {
              amount: orderAmount,
              confirm: true,
              confirmation_method: 'manual',
              currency: currency,
              payment_method_types: ['card'],
              payment_method: paymentMethodId,
              use_stripe_sdk: useStripeSdk
          }
          const intent = await stripe.paymentIntents.create(params);
          console.log(`Intent: ${intent}`);
          return res.send(generateResponse(intent));
      }
      return res.sendStatus(400);
  } catch (e) {
      return res.send({ error:e.message })
  }
}

const calculateOrderAmount = (items) => {
  prices = [];
  catalog = [
      {'id':'0', 'price':2.99},
      {'id':'2', 'price':3.99},
      {'id':'3', 'price':4.99},
      {'id':'4', 'price':5.99},
      {'id':'4', 'price':5.99}
  ];
  items.forEach(item => {
      price = catalog.find(x => x.id == item.id).price;
      prices.push(price);
  });

  return parseInt(prices.reduce((a, b) => a + b) * 100);
}

const generateResponse = function (intent){
  switch (intent.status) {
      case 'requires_action':
          return {
              clientSecret: intent.client_secret,
              requiresAction: true,
              status: intent.status
          }
      case 'requires_payment_method':
          return {'error': 'your card was denied, please provide a new method'}
      case 'succeeded':
          console.log('payment succeeded.');
          return {clientSecret: intent.client_secret,status:intent.status};
  
  }

  return {'error':'failed'};
}

async function calculateTotalProductPrice(customerId){

  var cart = await ShoppingCart.findOne({customerId: customerId});

  console.log(cart);
  var totalPrice = 0.00;
  cart.products.forEach(element => {
      console.log(element.productId.price);
      totalPrice = totalPrice + (parseFloat(element.productId.price) * element.quantity);
  });
  
  return totalPrice;
}