var mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
mongoose.connect('mongodb://localhost:27017/Ecommerce',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var Schema = mongoose.Schema;

var ProductSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    price: {
        type: mongoose.Types.Decimal128,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    description: {
        type: String,
        required: true
    }, 

    category: {
        type: Schema.Types.ObjectId,
        ref: 'ProductCategory'
    },

    attributes: [{
        type: Schema.Types.ObjectId,
        ref: 'ProductAttribute'
    }],
    tags: {
        type: Array,
        required: false
    },

    images: {
        type: Array,
        required: false
    }

});

ProductSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Product', ProductSchema);