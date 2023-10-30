var mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


var Schema = mongoose.Schema;

var ProductReviewSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    rating: {
        type: Number,
        enum: [1, 2, 3, 4, 5]
    },
    comment: {
        type: String,
        required: false
    },
    
},
{
    timestamps: true
}
);

// ProductReviewSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('ProductReview', ProductReviewSchema);