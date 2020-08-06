const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

let Schema = mongoose.Schema

let userSchema = new Schema({
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
    /*role: {
        type: String,
        required: true,
        default: "Guest"
    },*/
    firstName: String,
    lastName: String,
    phone: String
})

userSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

let User = module.exports = mongoose.model('User', userSchema)