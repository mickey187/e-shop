var mongoose = require('mongoose');
// const passportLocalMongoose = require('passport-local-mongoose');


var Schema = mongoose.Schema;
var ChatSchema = new Schema({

    user1:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    user2:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    messages: [
        {
            senderId:{
                type: Schema.Types.ObjectId,
                ref: 'User'
            },

            message: {
                type: String,
            },

            attachement: {
                type: String
            },

            isSeen:{
                type: Boolean,
                default: false
            },
            sentDate: {
                type: Date,
                required: true
            }
        }
    ]
},
{timestamps: true}
);

// ChatSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Chat', ChatSchema);