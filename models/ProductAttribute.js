var mongoose = require('mongoose');
eUnifiedTopology: true
// });
// const passportLocalMongoose = require('passport-local-mongoose');

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
// ProductAttributeSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('ProductAttribute', ProductAttributeSchema);