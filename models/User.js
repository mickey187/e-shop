var mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
mongoose.connect('mongodb://localhost:27017/Ecommerce',{
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
        enum: ['customer', 'system admin', 'sales manager', 'sales staff']
    }
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);