const PaymentChannel = require("../models/PaymentChannel");

const createPaymentChannelService = async (channelName, description) => {

    try {
        const paymentChannel =  new PaymentChannel({
            channelName: channelName,
            description: description
        }).save();
        

        return paymentChannel;

    } catch (error) {
        console.error(`Error creating channel: ${error.message}`);
        throw new Error(`Error creating new payment channel: ${error.message}`);
    }
}

module.exports = {
    createPaymentChannelService
}