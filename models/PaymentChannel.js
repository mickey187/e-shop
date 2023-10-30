var mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


var Schema = mongoose.Schema;
var PaymentChannelSchema = new Schema({

    channelName: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    }
});

// PaymentChannelSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('PaymentChannel', PaymentChannelSchema);