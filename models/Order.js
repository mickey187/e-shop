var mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
mongoose.connect('mongodb+srv://mickeyhailu:Bdu1011080@cluster0.w3tho.mongodb.net/Ecommerce',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var Schema = mongoose.Schema;
var OrderSchema = new Schema({

    customerId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [{
        productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'},
        quantity: {
            type: Number,
            required: true
        }
    }],
    trackingNumber:{
        type: String,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['active', 'delivered', 'canceled','delayed']
    }
},
{timestamps: true}
);

OrderSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Order', OrderSchema);