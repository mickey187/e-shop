var mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
mongoose.connect('mongodb://localhost:27017/Ecommerce',{
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
        
        
    }]

});

// ProductAttributeSchema.index({attributeName: 1, value: -1}, {unique: true});
ProductAttributeSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('ProductAttribute', ProductAttributeSchema);