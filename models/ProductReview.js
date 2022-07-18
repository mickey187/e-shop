var mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
mongoose.connect('mongodb+srv://mickeyhailu:Bdu1011080@cluster0.w3tho.mongodb.net/Ecommerce',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

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

ProductReviewSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('ProductReview', ProductReviewSchema);