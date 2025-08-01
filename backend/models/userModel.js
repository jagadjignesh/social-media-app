const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true,
        trim:true
    },
    email : {
        type:String,
        required: true,
        unique:true,
        lowercase:true,
        match: [/^\S+@\S+\.\S+$/, 'Email format is invalid']
    },
    password : {
        type : String,
        required: true
    },
    isverify : {
        type : Boolean,
        default : false
    },
    verificationotp: {
        type : String,
        trim : true
    },
    otpexpire:{
        type : String,
        trim : true
    },
    resetpasswordtoken:{
        type : String,
        trim : true
    }
});

const user = mongoose.model('User',userSchema);

module.exports = user;