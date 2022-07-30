const stripe = require('stripe')('sk_test_51LQdcMIBU3FsdwlicaqPCz4n3W3gxTbi7PojiQvaG1rAAY9LG5W9f7dmS3nxcvu2uGJpapBNedwel8gK7E1vycrK00R8PeQ7AL');
const endpointSecret = "whsec_8333b7d1983014deff8d5a47e1a39b9c19c9425ec050afdd7924709a334c0b37";

exports.createPaymentIntent = async(req, res)=>{
    
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 2500,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });
    
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
}

exports.listenStripeEvents = (request, response)=>{
    
    const sig = request.headers['stripe-signature'];

    let event;
  
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  
}
