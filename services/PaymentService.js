const stripe = require("stripe")(
  "sk_test_51LQdcMIBU3FsdwlicaqPCz4n3W3gxTbi7PojiQvaG1rAAY9LG5W9f7dmS3nxcvu2uGJpapBNedwel8gK7E1vycrK00R8PeQ7AL"
);
const { mongoose } = require("mongoose");
const Payment = require("../models/Payment");
const PaymentChannel = require("../models/PaymentChannel");

const saveStripePayment = async (stripePaymentObj) => {
  try {
    console.log("triggered", stripePaymentObj);

    const stripeCustomerId = stripePaymentObj.customer;

    console.log("stripeCustomerId: ", stripeCustomerId);

    const stripeCustomer = await retrieveStripeCustomer(stripeCustomerId);

    console.log("stripeCustomer: ", stripeCustomer);

    const mongoCustomerId = new mongoose.Types.ObjectId(
      stripeCustomer.metadata.customerId
    );

    console.log("mongoCustomerId: ", mongoCustomerId);

    const stripePaymentChannelId = await fetchStripePaymentChannelId();

    console.log("stripePaymentChannelId: ", stripePaymentChannelId);

    const totalAmountPaid = extractTotalAmountPaid(stripePaymentObj.amount);
    console.log("totalAmountPaid: ", totalAmountPaid);

    const payment = new Payment({
      customerId: mongoCustomerId,
      paymentChannel: stripePaymentChannelId,
      paymentReference: stripePaymentObj.payment_intent,
      totalAmountPaid: totalAmountPaid,
      transactionNumber: stripePaymentObj.id,
    }).save();

    return payment;
  } catch (error) {
    console.error(`Error saving stripe payment: ${error.message}`);
  }
};

const retrieveStripeCustomer = async (customerId) => {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return customer;
  } catch (error) {
    console.error(`Error fetching customer`);
  }
};

const fetchStripePaymentChannelId = async () => {
  try {
    const stripePaymentChannelId = await PaymentChannel.find({
      channelName: "Stripe",
    });
    if (!stripePaymentChannelId) {
        throw new Error("payment channel not found")
    }
    console.log("stripePaymentChannel: ", stripePaymentChannelId);
    return stripePaymentChannelId[0]._id;
  } catch (error) {
    console.error(`error fetch payment channel id: ${error.message}`);
  }
};

const extractTotalAmountPaid = (stripeAmount) => {
  try {
    return stripeAmount / 100;
  } catch (error) {
    console.error(`error extracting stripe amount: ${error.message}`);
  }
};

module.exports = { saveStripePayment, retrieveStripeCustomer };
