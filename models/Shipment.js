var mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
mongoose.connect('mongodb+srv://mickeyhailu:Bdu1011080@cluster0.w3tho.mongodb.net/Ecommerce',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var Schema = mongoose.Schema;
var ShipmentSchema = new Schema({

    orderId: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    },

    fromAddress: {
        type: String,
        required: true
    },

    toAddress: {
        type: String,
        required: true
    },
    
    shippingMethod:{
        type: String,
        required: true
    }
},
{timestamps: true}
);

// ShipmentSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Shipment', ShipmentSchema);