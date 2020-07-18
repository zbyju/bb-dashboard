const mongoose = require('mongoose')

let Schema = mongoose.Schema

let userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: "Guest"
    },
    firstName: String,
    lastName: String,
    phone: String
})

let User = module.exports = mongoose.model('User', userSchema)