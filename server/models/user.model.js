import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: "https://i.pinimg.com/originals/60/13/a3/6013a33f806d8d74f43ee2eb565ff4dc.jpg"
    }
}, {timestamps: true})

const User = new mongoose.model('User', userSchema)

export default User