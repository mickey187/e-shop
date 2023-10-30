var mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


var Schema = mongoose.Schema;
var OrderSchema = new Schema({

    customerId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    trackingNumber:{
        type: String,
        required: true,
        unique: true
    },

    paymentReference:{
        type: String,
        required: true,
        unique: true
    },
    orderStatus: {
        type: String,
        enum: ['active', 'delivered', 'canceled','delayed'],
        required: true
    }
},
{timestamps: true}
);

// OrderSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Order', OrderSchema);