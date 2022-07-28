var mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// mongoose.connect('mongodb://localhost:27017/Ecommerce',{
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

mongoose.connect('mongodb+srv://mickeyhailu:Bdu1011080@cluster0.w3tho.mongodb.net/Ecommerce',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var Schema = mongoose.Schema;

var UserSchema = new Schema({

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    
    // password: {
    //     type: String,
    //     required: true
    // },

    role: {
        type: String,
        enum: ['customer', 'system_admin', 'sales_manager', 'sales_staff'], 
        required: true
    },

},
{timestamps: true}
);

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);