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
        ref: 'Product'
    }]

});