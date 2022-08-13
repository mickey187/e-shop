var mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
mongoose.connect('mongodb+srv://mickeyhailu:Bdu1011080@cluster0.w3tho.mongodb.net/Ecommerce',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var Schema = mongoose.Schema;
var PaymentSchema = new Schema({

    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true        
    },
    
    orderId: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },

    paymentChannel: {
        type: String,
        required: true
    },

    paymentReference:{
        type: String,
        required: true,
        unique: true
    },

    totalAmountPaid: {
        type: mongoose.Types.Decimal128,
        required: true
    },

    transactionNumber: {
        type: String,
        required: true
    }
},
{timestamps: true}
);

// PaymentSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Payment', PaymentSchema);