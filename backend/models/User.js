const mongoose = require('mongoose');

const { Schema } = mongoose;
const UserSchema = new Schema({
    name: {
        type: String,
        required: 'Please enter your name',
        trim: true
    }, 
    email: {
        type: String,
        required: 'Please enter your eamil',
        trim: true,
        unique:true
    },
    password: {
        type: String,
        required: 'Please enter your password',
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const User = mongoose.model('user', UserSchema)
module.exports =  User