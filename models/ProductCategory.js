var mongoose = require('mongoose');

// const passportLocalMongoose = require('passport-local-mongoose');

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