const mongoose = require('mongoose')
let Schema = mongoose.Schema

let dataSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: Number,
    time: {
        type: Date,
        required: true,
        default: Date.now
    },
    temperature: {
        outside: Number,
        inner: Number,
        bottom: Number,
        top: Number,
        casing: Number
    },
    voltage: {
        in: Number,
        battery: Number
    }
})

let Data = module.exports = mongoose.model('Data', dataSchema)