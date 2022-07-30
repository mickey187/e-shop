var mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
mongoose.connect('mongodb+srv://mickeyhailu:Bdu1011080@cluster0.w3tho.mongodb.net/Ecommerce',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

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