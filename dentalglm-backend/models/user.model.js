import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    profile:{
        type: String,
        default: 'https://firebasestorage.googleapis.com/v0/b/dentalglm.appspot.com/o/defaultUser.png?alt=media&token=6a1af730-4c4b-4dca-8904-64e297690b71',
    },
    role: {
        type: String,
        default: 'student',
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;