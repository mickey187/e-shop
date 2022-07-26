var mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
mongoose.connect('mongodb+srv://mickeyhailu:Bdu1011080@cluster0.w3tho.mongodb.net/Ecommerce',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var Schema = mongoose.Schema;
var ShoppingCartSchema = new Schema({

    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    },
    products: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                required: true
            }

            
        }
    ]
},
{timestamps: true}
);

ShoppingCartSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('ShoppingCart', ShoppingCartSchema);