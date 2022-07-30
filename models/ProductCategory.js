var mongoose = require('mongoose');
// const passportLocalMongoose = require('passport-local-mongoose');
// mongoose.connect('mongodb://localhost:27017/Ecommerce',{
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });
const passportLocalMongoose = require('passport-local-mongoose');
mongoose.connect('mongodb+srv://mickeyhailu:Bdu1011080@cluster0.w3tho.mongodb.net/Ecommerce',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var Schema = mongoose.Schema;

var ProductCategorySchema = new Schema({

    category:{
        type: String,
        required: true
        
    },

    subCategory:{
        type: String,
        required: true
    },

    image: {
        type: String,
        default: ""
    },

    products: [{
        type: Schema.Types.ObjectId,
        sparse: true,
        ref: 'Product'
    }],
    

},
{timestamps: true}
);

ProductCategorySchema.index({category: 1, subCategory: -1}, {unique: true});

// ProductCategorySchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('ProductCategory', ProductCategorySchema);