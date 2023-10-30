var mongoose = require('mongoose');
// const passportLocalMongoose = require('passport-local-mongoose');


var Schema = mongoose.Schema;
var ShoppingCartSchema = new Schema({

    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    },
    products: [
        {   _id: false,
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
               
            },
            quantity: {
                type: Number,
                required: true
            }

            
        },
        
    ]
},
{timestamps: true}
);

// ShoppingCartSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('ShoppingCart', ShoppingCartSchema);