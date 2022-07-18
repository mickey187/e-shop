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

var ProductAttributeSchema = new Schema({
    attributeName: {
        type: String,
        required: true
    },

    value: {
        type: String,
        required: true
    },

    Product: [{
        type: Schema.Types.ObjectId,
        sparse: true,
        ref: 'Product'
        
        
    }],


},
{timestamps: true}
);

// ProductAttributeSchema.index({attributeName: 1, value: -1}, {unique: true});
ProductAttributeSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('ProductAttribute', ProductAttributeSchema);