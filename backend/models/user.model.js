import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

    role: {
        type: String,
        enum: ['admin', 'user'],
        required: true,
    },
//  for admin
    username: {
        type: String,
    },
    password: {
        type: String
    },
//  for user
    email:{
        type: String,
    },
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    },
    otpSentAt: {
        type: Date,
    },

}, {
    timestamps: true,
});
const User = mongoose.model('User', userSchema);

export default User;