var mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
mongoose.connect('mongodb://localhost:27017/Ecommerce',{
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

    products: [{
        type: Schema.Types.ObjectId,
        sparse: true,
        ref: 'Product'
    }]

});

ProductCategorySchema.index({category: 1, subCategory: -1}, {unique: true});

ProductCategorySchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('ProductCategory', ProductCategorySchema);