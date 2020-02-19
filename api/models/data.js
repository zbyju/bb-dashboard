const mongoose = require('mongoose')

let Schema = mongoose.Schema

let dataSchema = new Schema({
    idBabybox: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Babybox',
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

dataSchema.pre('save', function(next) {
    //console.log(Babybox)
    Babybox.findByIdAndUpdate(this.idBabybox,
        { $set: { lastData: this.id } }, (err) => {
            if(err) {
                console.log(err)
            }
        });
    next()
})

let Data = module.exports = mongoose.model('Data', dataSchema)

let Babybox = require('./babybox')