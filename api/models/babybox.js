const mongoose = require('mongoose')
let Schema = mongoose.Schema

let babyboxSchema = new Schema({
    //Babybox sends data with this name in the URL
    name: {
        type: String,
        required: true
    },
    //User can rename the babybox to his liking
    customName: String,
    installDate: Date,
    lastServisDate: Date,
    active: {
        type: Boolean,
        default: true,
        required: true
    },
    address: {
        hospitalName: String,
        street: String,
        city: String,
        postcode: String
    },
    network: {
        //Possible types of network: 0 - not known, 1 - vlan, 2 - routing, 3 - their network, 4 - other
        networkType: {
            type: Number,
            default: 0
        },
        ip: {
            pc: String,
            pcMask: String,
            pcGateway: String,
            routerLAN: String,
            routerWAN: String,
            routerGateway: String,
            SDSTopeni: String,
            SDSMotory: String,
            camera: String
        },
        components: {
            camera: String,
            OS: String,
            PC: String
        },
        notes: String
    },
    phones: [{
        name: String,
        phoneNumber: String,
        note: String
    }]
})

babyboxSchema.pre('save', next => {
    this.customName = this.get('name')
    next()
})

let Babybox = module.exports = mongoose.model('Babybox', babyboxSchema)