var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
// const passportLocalMongoose = require('passport-local-mongoose');
// mongoose.connect('mongodb://localhost:27017/Ecommerce',{
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

const passportLocalMongoose = require('passport-local-mongoose');
mongoose.connect('mongodb+srv://mickeyhailu:Bdu1011080@cluster0.w3tho.mongodb.net/Ecommerce',{
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected..."))
.catch(err => console.log(err));;
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
    },

    relatedProducts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
},

{timestamps: true}

);

// ProductSchema.plugin(passportLocalMongoose);
ProductSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', ProductSchema);

